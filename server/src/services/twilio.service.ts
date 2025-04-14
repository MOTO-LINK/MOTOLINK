import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export class TwilioService {
	private static generateVerificationCode(): string {
		return Math.floor(100000 + Math.random() * 900000).toString();
	}

	async sendVerificationCode(phoneNumber: string): Promise<string> {
		try {
			const verificationCode = TwilioService.generateVerificationCode();

			await client.messages.create({
				body: `Your MotoLink verification code is: ${verificationCode}`,
				from: process.env.TWILIO_PHONE_NUMBER,
				to: phoneNumber
			});

			return verificationCode;
		} catch (error) {
			throw new Error("Failed to send verification code");
		}
	}
}
