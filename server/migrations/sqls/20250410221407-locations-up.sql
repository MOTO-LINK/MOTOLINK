CREATE TABLE IF NOT EXISTS locations (
	location_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	name VARCHAR(255),
	address TEXT NOT NULL,
	latitude DECIMAL(10, 8) NOT NULL,
	longitude DECIMAL(11, 8) NOT NULL,
	type location_type NOT NULL,
	user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
	is_default BOOLEAN DEFAULT false,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_locations_updated_at BEFORE
UPDATE
	ON locations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();