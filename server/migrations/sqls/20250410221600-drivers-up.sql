CREATE TABLE IF NOT EXISTS drivers (
	driver_id UUID PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
	national_id VARCHAR(50) UNIQUE NOT NULL,
	vehicle_registration_number VARCHAR(50) UNIQUE NOT NULL,
	vehicle_type vehicle_type NOT NULL,
	order_types order_type,
	current_location_id UUID REFERENCES locations(location_id),
	is_online BOOLEAN DEFAULT false,
	verified BOOLEAN DEFAULT false,
	verification_status verification_status DEFAULT 'pending',
	rating DECIMAL(3, 2) DEFAULT 0.0,
	documents JSONB,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_drivers_updated_at BEFORE
UPDATE
	ON drivers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();