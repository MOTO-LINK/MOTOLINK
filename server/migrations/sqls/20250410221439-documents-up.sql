CREATE TABLE IF NOT EXISTS documents (
	document_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
	document_type document_type NOT NULL,
	document_url TEXT NOT NULL,
	verification_status verification_status DEFAULT 'pending',
	verified_by UUID REFERENCES users(user_id),
	verification_date TIMESTAMP WITH TIME ZONE,
	expiry_date TIMESTAMP WITH TIME ZONE,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_documents_updated_at BEFORE
UPDATE
	ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();