CREATE TABLE IF NOT EXISTS notifications (
	notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
	notification_type notification_type NOT NULL,
	message_content TEXT NOT NULL,
	viewed BOOLEAN DEFAULT false,
	sent BOOLEAN DEFAULT false,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);