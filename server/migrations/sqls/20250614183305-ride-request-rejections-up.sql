CREATE TABLE IF NOT EXISTS ride_request_rejections (
	id SERIAL PRIMARY KEY,
	request_id UUID NOT NULL,
	driver_id UUID NOT NULL
);