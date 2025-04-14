CREATE TABLE IF NOT EXISTS phone_numbers (
	user_id UUID PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
	phone_number VARCHAR(20) UNIQUE NOT NULL,
	verified BOOLEAN DEFAULT false,
	verification_code VARCHAR(6),
	last_verification_attempt TIMESTAMP WITH TIME ZONE
);