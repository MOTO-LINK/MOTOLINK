-- Drop Users indexes
DROP INDEX IF EXISTS idx_users_email;

DROP INDEX IF EXISTS idx_users_user_type;

-- Drop Phone numbers indexes
DROP INDEX IF EXISTS idx_phone_numbers_number;

-- Drop Locations indexes
DROP INDEX IF EXISTS idx_locations_user;

DROP INDEX IF EXISTS idx_locations_lat;

DROP INDEX IF EXISTS idx_locations_lng;

DROP INDEX IF EXISTS idx_locations_lat_lng;

DROP INDEX IF EXISTS idx_locations_type;

-- Drop Documents indexes
DROP INDEX IF EXISTS idx_documents_user;

DROP INDEX IF EXISTS idx_documents_type;

DROP INDEX IF EXISTS idx_documents_verification_status;

-- Drop Riders indexes
DROP INDEX IF EXISTS idx_riders_rating;

DROP INDEX IF EXISTS idx_riders_location;

-- Drop Drivers indexes
DROP INDEX IF EXISTS idx_drivers_vehicle_type;

DROP INDEX IF EXISTS idx_drivers_verification_status;

DROP INDEX IF EXISTS idx_drivers_rating;

DROP INDEX IF EXISTS idx_drivers_location;

DROP INDEX IF EXISTS idx_drivers_online_status;

DROP INDEX IF EXISTS idx_drivers_vehicle_reg;

-- Drop Notifications indexes
DROP INDEX IF EXISTS idx_notifications_user;

DROP INDEX IF EXISTS idx_notifications_type;

DROP INDEX IF EXISTS idx_notifications_viewed;

DROP INDEX IF EXISTS idx_notifications_created_at;

-- Drop Wallets indexes
DROP INDEX IF EXISTS idx_wallets_user;

DROP INDEX IF EXISTS idx_wallets_status;

-- Drop Wallet transactions indexes
DROP INDEX IF EXISTS idx_wallet_transactions_wallet;

DROP INDEX IF EXISTS idx_wallet_transactions_type;

DROP INDEX IF EXISTS idx_wallet_transactions_status;

DROP INDEX IF EXISTS idx_wallet_transactions_created_at;

DROP INDEX IF EXISTS idx_wallet_transactions_reference;

-- Drop Ride requests indexes
DROP INDEX IF EXISTS idx_ride_requests_rider;

DROP INDEX IF EXISTS idx_ride_requests_driver;

DROP INDEX IF EXISTS idx_ride_requests_status;

DROP INDEX IF EXISTS idx_ride_requests_type;

DROP INDEX IF EXISTS idx_ride_requests_service_type;

DROP INDEX IF EXISTS idx_ride_requests_created_at;

DROP INDEX IF EXISTS idx_ride_requests_locations;

-- Drop Ride transactions indexes
DROP INDEX IF EXISTS idx_ride_transactions_request;

DROP INDEX IF EXISTS idx_ride_transactions_driver;

DROP INDEX IF EXISTS idx_ride_transactions_payment_status;

DROP INDEX IF EXISTS idx_ride_transactions_created_at;

DROP INDEX IF EXISTS idx_ride_transactions_times;

-- Drop Gateway transactions indexes
DROP INDEX IF EXISTS idx_gateway_transactions_user;

DROP INDEX IF EXISTS idx_gateway_transactions_wallet;

DROP INDEX IF EXISTS idx_gateway_transactions_status;

DROP INDEX IF EXISTS idx_gateway_transactions_created_at;

DROP INDEX IF EXISTS idx_gateway_transactions_invoice;

-- Drop Reports indexes
DROP INDEX IF EXISTS idx_reports_reporter;

DROP INDEX IF EXISTS idx_reports_reported;

DROP INDEX IF EXISTS idx_reports_type;

DROP INDEX IF EXISTS idx_reports_status;

DROP INDEX IF EXISTS idx_reports_created_at;

-- Drop Ratings indexes
DROP INDEX IF EXISTS idx_ratings_transaction;

DROP INDEX IF EXISTS idx_ratings_rating_user;

DROP INDEX IF EXISTS idx_ratings_rated_user;

DROP INDEX IF EXISTS idx_ratings_value;