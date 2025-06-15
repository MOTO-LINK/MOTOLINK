import axios from "axios";
import crypto from "crypto";
import config from "../utils/config";
import pool from "../utils/database";

interface PaymentSessionData {
	paymentUrl: string;
	paymentId: string;
}

interface PaymentInfo {
	userId: string;
	amount: number;
	orderId: string;
}

class PaymobService {
	private apiUrl = "https://accept.paymob.com/api";
	private apiKey: string;
	private integrationIds: string;
	private hmacSecret: string;

	constructor() {
		this.apiKey = config.paymob.apiKey || "";
		this.integrationIds = config.paymob.integrationIds || [];
		this.hmacSecret = config.paymob.hmacSecret || "";
	}

	async createPaymentSession(data: {
		userId: string;
		amount: number;
		currency: string;
		purpose: string;
	}): Promise<PaymentSessionData> {
		try {
			// Step 1: Authentication
			const authResponse = await axios.post(`${this.apiUrl}/auth/tokens`, {
				api_key: this.apiKey
			});
			const authToken = authResponse.data.token;

			// Step 2: Create Order
			const orderResponse = await axios.post(`${this.apiUrl}/ecommerce/orders`, {
				auth_token: authToken,
				api_source: "INVOICE",
				amount_cents: data.amount * 100, // Convert to cents
				currency: data.currency,
				integrations: this.integrationIds,
				items: [
					{
						name: "Wallet Top-up",
						amount_cents: data.amount * 100,
						quantity: 1
					}
				],
				delivery_needed: "false"
			});
			const orderId = orderResponse.data.id;
			const orderPaymentUrl = orderResponse.data.url;

			/**
			// Step 3: Create Payment Key
			const paymentKeyResponse = await axios.post(`${this.apiUrl}/acceptance/payment_keys`, {
				auth_token: authToken,
				amount_cents: data.amount * 100,
				expiration: 3600, // 1 hour
				order_id: orderId,
				billing_data: {
					apartment: "NA",
					email: `user_${data.userId}@motolink.com`,
					floor: "NA",
					first_name: "User",
					street: "NA",
					building: "NA",
					phone_number: "+201234567890",
					shipping_method: "NA",
					postal_code: "NA",
					city: "Cairo",
					country: "EG",
					last_name: data.userId,
					state: "NA"
				},
				currency: data.currency,
				integration_id: this.integrationId,
				lock_order_when_paid: "false",
				metadata: {
					userId: data.userId,
					purpose: data.purpose
				}
			});
			

			const paymentToken = paymentKeyResponse.data.token;
			const iframeId = config.paymob.iframeId || "YOUR_IFRAME_ID";
			*/
			return {
				paymentUrl: orderPaymentUrl,
				paymentId: orderId.toString()
			};
		} catch (error) {
			console.error("Paymob payment session creation failed:", error);
			throw new Error("Failed to create payment session");
		}
	}

	verifyPayment(paymentData: any): boolean {
		try {
			// Verify HMAC
			const concatenatedString = [
				paymentData.amount_cents,
				paymentData.created_at,
				paymentData.currency,
				paymentData.error_occured,
				paymentData.has_parent_transaction,
				paymentData.id,
				paymentData.integration_id,
				paymentData.is_3d_secure,
				paymentData.is_auth,
				paymentData.is_capture,
				paymentData.is_refunded,
				paymentData.is_standalone_payment,
				paymentData.is_voided,
				paymentData.order?.id,
				paymentData.owner,
				paymentData.pending,
				paymentData.source_data?.pan || paymentData.source_data?.phone_number,
				paymentData.source_data?.sub_type,
				paymentData.source_data?.type,
				paymentData.success
			].join("");

			const calculatedHmac = crypto
				.createHmac("sha512", this.hmacSecret)
				.update(concatenatedString)
				.digest("hex");

			return calculatedHmac === paymentData.hmac;
		} catch (error) {
			console.error("Payment verification failed:", error);
			return false;
		}
	}

	async extractPaymentInfo(paymentData: any): Promise<PaymentInfo> {
		return {
			userId: paymentData.order?.shipping_data?.last_name || paymentData.metadata?.userId,
			amount: paymentData.amount_cents / 100,
			orderId: paymentData.order?.id?.toString() || paymentData.id
		};
	}

	async refundPayment(transactionId: string, amount: number): Promise<boolean> {
		try {
			// Step 1: Authentication
			const authResponse = await axios.post(`${this.apiUrl}/auth/tokens`, {
				api_key: this.apiKey
			});
			const authToken = authResponse.data.token;

			// Step 2: Create Refund
			const refundResponse = await axios.post(
				`${this.apiUrl}/acceptance/void_refund/refund`,
				{
					auth_token: authToken,
					transaction_id: transactionId,
					amount_cents: amount * 100
				}
			);

			return refundResponse.data.success === true;
		} catch (error) {
			console.error("Refund failed:", error);
			return false;
		}
	}

	async savePaymentData(paymentData: any, userId: string, walletTransactionId: string) {
		const query =
			"INSERT INTO gateway_transactions (invoice_id, userId, wallet_transaction_id, payment_data, payment_status) VALUES ($1, $2, $3, $4, $5) RETURNING *";

		try {
			let paymentStatus = "success";
			if (paymentData.pending) paymentStatus = "pending";
			if (paymentData.is_refunded) paymentStatus = "refunded";
			if (paymentData.is_voided) paymentStatus = "cancelled";

			const result = await pool.query(query, [
				paymentData.id,
				userId,
				walletTransactionId,
				JSON.stringify(paymentData),
				paymentStatus
			]);
			return result.rows[0];
		} catch (error) {
			console.error("Failed to save payment data:", error);
			return null;
		}
	}
}

export default new PaymobService();
