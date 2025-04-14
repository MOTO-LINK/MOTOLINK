CREATE TABLE IF NOT EXISTS ratings (
	rating_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	ride_transaction_id UUID REFERENCES ride_transactions(transaction_id) ON DELETE CASCADE,
	rating_user_id UUID REFERENCES users(user_id),
	rated_user_id UUID REFERENCES users(user_id),
	rating_value INTEGER CHECK (
		rating_value >= 1
		AND rating_value <= 5
	),
	feedback TEXT,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);