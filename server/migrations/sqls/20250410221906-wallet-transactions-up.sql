CREATE TABLE IF NOT EXISTS wallet_transactions (
	transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	wallet_id UUID REFERENCES wallets(wallet_id) ON DELETE CASCADE,
	amount DECIMAL(10, 2) NOT NULL,
	type transaction_type NOT NULL,
	purpose transaction_purpose NOT NULL,
	status transaction_status DEFAULT 'pending',
	reference_id UUID,
	description TEXT,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);