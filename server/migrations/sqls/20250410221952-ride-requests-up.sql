CREATE TABLE IF NOT EXISTS ride_requests (
	request_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	rider_id UUID REFERENCES riders(rider_id) ON DELETE CASCADE,
	driver_id UUID REFERENCES drivers(driver_id),
	start_location_id UUID REFERENCES locations(location_id),
	end_location_id UUID REFERENCES locations(location_id),
	ride_type vehicle_type NOT NULL,
	service_type service_type NOT NULL,
	package_details JSONB,
	distance DECIMAL(10, 2),
	estimated_fee DECIMAL(10, 2),
	request_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	status ride_status DEFAULT 'pending',
	cancel_reason TEXT,
	notes TEXT,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_ride_requests_updated_at BEFORE
UPDATE
	ON ride_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();