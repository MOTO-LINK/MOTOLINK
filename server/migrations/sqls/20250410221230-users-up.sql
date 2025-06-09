CREATE TABLE IF NOT EXISTS users (
	user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	name VARCHAR(255) NOT NULL,
	email VARCHAR(255) UNIQUE NOT NULL,
	password VARCHAR(255) NOT NULL,
	profile_picture VARCHAR(255),
	dob DATE,
	user_type user_type NOT NULL,
	account_locked BOOLEAN DEFAULT false,
	default_location_id UUID,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	last_login TIMESTAMP WITH TIME ZONE
);

-- Create updated_at trigger
CREATE
OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = CURRENT_TIMESTAMP;

RETURN NEW;

END;

$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE
UPDATE
	ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();