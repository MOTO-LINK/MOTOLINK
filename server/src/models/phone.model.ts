import pool from '../utils/database';

export interface PhoneNumber {
  user_id: string;
  phone_number: string;
  verified: boolean;
  verification_code?: string;
  last_verification_attempt: Date;
}

export class PhoneModel {
  async create(phoneData: Omit<PhoneNumber, 'verified' | 'last_verification_attempt'>): Promise<PhoneNumber> {
    const result = await pool.query(
      `INSERT INTO phone_numbers (
        user_id, phone_number, verified, verification_code, last_verification_attempt
      ) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING *`,
      [phoneData.user_id, phoneData.phone_number, false, phoneData.verification_code]
    );
    return result.rows[0];
  }

  async findByUserId(userId: string): Promise<PhoneNumber | null> {
    const result = await pool.query(
      'SELECT * FROM phone_numbers WHERE user_id = $1',
      [userId]
    );
    return result.rows[0] || null;
  }

  async findByPhoneNumber(phoneNumber: string): Promise<PhoneNumber | null> {
    const result = await pool.query(
      'SELECT * FROM phone_numbers WHERE phone_number = $1',
      [phoneNumber]
    );
    return result.rows[0] || null;
  }

  async updateVerificationCode(userId: string, code: string): Promise<void> {
    await pool.query(
      `UPDATE phone_numbers 
       SET verification_code = $1, last_verification_attempt = CURRENT_TIMESTAMP 
       WHERE user_id = $2`,
      [code, userId]
    );
  }

  async verify(userId: string, code: string): Promise<boolean> {
    const result = await pool.query(
      `UPDATE phone_numbers 
       SET verified = true, verification_code = NULL 
       WHERE user_id = $1 AND verification_code = $2 
       RETURNING *`,
      [userId, code]
    );
    return result.rowCount! > 0;
  }
}