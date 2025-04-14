CREATE TABLE IF NOT EXISTS ride_transactions (
	transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	request_id UUID REFERENCES ride_requests(request_id) ON DELETE CASCADE,
	driver_id UUID REFERENCES drivers(driver_id),
	start_time TIMESTAMP WITH TIME ZONE,
	end_time TIMESTAMP WITH TIME ZONE,
	actual_distance DECIMAL(10, 2),
	payment_status payment_status DEFAULT 'pending',
	base_fare DECIMAL(10, 2) NOT NULL,
	platform_fee DECIMAL(10, 2) NOT NULL,
	tax_amount DECIMAL(10, 2) NOT NULL,
	cancellation_fee DECIMAL(10, 2) DEFAULT 0.00,
	discount_amount DECIMAL(10, 2) DEFAULT 0.00,
	total_fee DECIMAL(10, 2) NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_ride_transactions_updated_at BEFORE
UPDATE
	ON ride_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();