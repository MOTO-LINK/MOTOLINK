-- Create ENUM types
DROP TYPE IF EXISTS user_type;

CREATE TYPE user_type AS ENUM ('rider', 'driver', 'admin');

-- Notification Types
DROP TYPE IF EXISTS notification_type;

CREATE TYPE notification_type AS ENUM ('system', 'ride', 'message');

-- Vehicle Types
DROP TYPE IF EXISTS vehicle_type;

CREATE TYPE vehicle_type AS ENUM ('motorcycle', 'rickshaw', 'scooter');

-- Verification Status
DROP TYPE IF EXISTS verification_status;

CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'declined', 'rejected');

-- Location Types
DROP TYPE IF EXISTS location_type;

CREATE TYPE location_type AS ENUM ('pickup', 'dropoff', 'current', 'saved');

-- Document Types
DROP TYPE IF EXISTS document_type;

CREATE TYPE document_type AS ENUM (
	'national_id',
	'vehicle_registration',
	'license',
	'insurance'
);

-- Wallet Status
DROP TYPE IF EXISTS wallet_status;

CREATE TYPE wallet_status AS ENUM ('active', 'inactive', 'suspended');

-- Transaction Types
DROP TYPE IF EXISTS transaction_type;

CREATE TYPE transaction_type AS ENUM ('credit', 'debit', 'ewallet');

-- Transaction Purpose
DROP TYPE IF EXISTS transaction_purpose;

CREATE TYPE transaction_purpose AS ENUM (
	'ride_payment',
	'top_up',
	'withdrawal',
	'refund',
	'cancellation_fee'
);

-- Transaction Status
DROP TYPE IF EXISTS transaction_status;

CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'reversed');

-- Service Type
DROP TYPE IF EXISTS service_type;

CREATE TYPE service_type AS ENUM ('delivery', 'transportation');

-- Ride Status
DROP TYPE IF EXISTS ride_status;

CREATE TYPE ride_status AS ENUM ('pending', 'accepted', 'completed', 'cancelled');

-- Payment Status
DROP TYPE IF EXISTS payment_status;

CREATE TYPE payment_status AS ENUM ('pending', 'success', 'failure', 'refunded');

-- Report Type
DROP TYPE IF EXISTS report_type;

CREATE TYPE report_type AS ENUM ('application', 'driver', 'rider');

-- Report Status
DROP TYPE IF EXISTS report_status;

CREATE TYPE report_status AS ENUM ('pending', 'resolved', 'dismissed');