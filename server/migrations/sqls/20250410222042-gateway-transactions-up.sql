CREATE TABLE IF NOT EXISTS gateway_transactions (
	transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id UUID REFERENCES users(user_id),
	wallet_transaction_id UUID REFERENCES wallet_transactions(transaction_id),
	total_fee DECIMAL(10, 2) NOT NULL,
	payment_status payment_status DEFAULT 'pending',
	invoice_id VARCHAR(255),
	payment_data JSONB,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_gateway_transactions_updated_at BEFORE
UPDATE
	ON gateway_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();