import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();


class TwilioService {
	async sendVerificationCode(phoneNumber: string, verificationCode: string): Promise<string> {
		return "123456";
		const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
		try {
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

export default new TwilioService();
