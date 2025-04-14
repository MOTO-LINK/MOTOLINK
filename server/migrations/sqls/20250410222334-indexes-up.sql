-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);

-- Phone numbers indexes
CREATE INDEX IF NOT EXISTS idx_phone_numbers_number ON phone_numbers(phone_number);

-- Locations indexes
CREATE INDEX IF NOT EXISTS idx_locations_user ON locations(user_id);

CREATE INDEX IF NOT EXISTS idx_locations_lat ON locations(latitude);

CREATE INDEX IF NOT EXISTS idx_locations_lng ON locations(longitude);

CREATE INDEX IF NOT EXISTS idx_locations_lat_lng ON locations(latitude, longitude);

CREATE INDEX IF NOT EXISTS idx_locations_type ON locations(type);

-- Documents indexes
CREATE INDEX IF NOT EXISTS idx_documents_user ON documents(user_id);

CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(document_type);

CREATE INDEX IF NOT EXISTS idx_documents_verification_status ON documents(verification_status);

-- Riders indexes
CREATE INDEX IF NOT EXISTS idx_riders_rating ON riders(rating);

CREATE INDEX IF NOT EXISTS idx_riders_location ON riders(current_location_id);

-- Drivers indexes
CREATE INDEX IF NOT EXISTS idx_drivers_vehicle_type ON drivers(vehicle_type);

CREATE INDEX IF NOT EXISTS idx_drivers_verification_status ON drivers(verification_status);

CREATE INDEX IF NOT EXISTS idx_drivers_rating ON drivers(rating);

CREATE INDEX IF NOT EXISTS idx_drivers_location ON drivers(current_location_id);

CREATE INDEX IF NOT EXISTS idx_drivers_online_status ON drivers(is_online);

CREATE INDEX IF NOT EXISTS idx_drivers_vehicle_reg ON drivers(vehicle_registration_number);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(notification_type);

CREATE INDEX IF NOT EXISTS idx_notifications_viewed ON notifications(viewed);

CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Wallets indexes
CREATE INDEX IF NOT EXISTS idx_wallets_user ON wallets(user_id);

CREATE INDEX IF NOT EXISTS idx_wallets_status ON wallets(status);

-- Wallet transactions indexes
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_wallet ON wallet_transactions(wallet_id);

CREATE INDEX IF NOT EXISTS idx_wallet_transactions_type ON wallet_transactions(type);

CREATE INDEX IF NOT EXISTS idx_wallet_transactions_status ON wallet_transactions(status);

CREATE INDEX IF NOT EXISTS idx_wallet_transactions_created_at ON wallet_transactions(created_at);

CREATE INDEX IF NOT EXISTS idx_wallet_transactions_reference ON wallet_transactions(reference_id);

-- Ride requests indexes
CREATE INDEX IF NOT EXISTS idx_ride_requests_rider ON ride_requests(rider_id);

CREATE INDEX IF NOT EXISTS idx_ride_requests_driver ON ride_requests(driver_id);

CREATE INDEX IF NOT EXISTS idx_ride_requests_status ON ride_requests(status);

CREATE INDEX IF NOT EXISTS idx_ride_requests_type ON ride_requests(ride_type);

CREATE INDEX IF NOT EXISTS idx_ride_requests_service_type ON ride_requests(service_type);

CREATE INDEX IF NOT EXISTS idx_ride_requests_created_at ON ride_requests(created_at);

CREATE INDEX IF NOT EXISTS idx_ride_requests_locations ON ride_requests(start_location_id, end_location_id);

-- Ride transactions indexes
CREATE INDEX IF NOT EXISTS idx_ride_transactions_request ON ride_transactions(request_id);

CREATE INDEX IF NOT EXISTS idx_ride_transactions_driver ON ride_transactions(driver_id);

CREATE INDEX IF NOT EXISTS idx_ride_transactions_payment_status ON ride_transactions(payment_status);

CREATE INDEX IF NOT EXISTS idx_ride_transactions_created_at ON ride_transactions(created_at);

CREATE INDEX IF NOT EXISTS idx_ride_transactions_times ON ride_transactions(start_time, end_time);

-- Gateway transactions indexes
CREATE INDEX IF NOT EXISTS idx_gateway_transactions_user ON gateway_transactions(user_id);

CREATE INDEX IF NOT EXISTS idx_gateway_transactions_wallet ON gateway_transactions(wallet_transaction_id);

CREATE INDEX IF NOT EXISTS idx_gateway_transactions_status ON gateway_transactions(payment_status);

CREATE INDEX IF NOT EXISTS idx_gateway_transactions_created_at ON gateway_transactions(created_at);

CREATE INDEX IF NOT EXISTS idx_gateway_transactions_invoice ON gateway_transactions(invoice_id);

-- Reports indexes
CREATE INDEX IF NOT EXISTS idx_reports_reporter ON reports(reporter_id);

CREATE INDEX IF NOT EXISTS idx_reports_reported ON reports(reported_user_id);

CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(report_type);

CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);

CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at);

-- Ratings indexes
CREATE INDEX IF NOT EXISTS idx_ratings_transaction ON ratings(ride_transaction_id);

CREATE INDEX IF NOT EXISTS idx_ratings_rating_user ON ratings(rating_user_id);

CREATE INDEX IF NOT EXISTS idx_ratings_rated_user ON ratings(rated_user_id);

CREATE INDEX IF NOT EXISTS idx_ratings_value ON ratings(rating_value);