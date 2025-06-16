CREATE TABLE IF NOT EXISTS ride_request_rejections (
	id SERIAL PRIMARY KEY,
	request_id UUID REFERENCES ride_requests(request_id) NOT NULL ON DELETE CASCADE,
	driver_id UUID REFERENCES drivers(driver_id) NOT NULL ON DELETE CASCADE
);