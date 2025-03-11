DROP TYPE IF EXISTS "UserType";

CREATE TYPE "UserType" AS ENUM ('Rider', 'Driver', 'RiderAndDriver', 'Admin');

DROP TYPE IF EXISTS "VehicleType";

CREATE TYPE "VehicleType" AS ENUM ('Rickshaw', 'Motorcycle', 'Scooter');

DROP TYPE IF EXISTS "VerificationStatus";

CREATE TYPE "VerificationStatus" AS ENUM ('Pending', 'Verified', 'Rejected');

DROP TYPE IF EXISTS "ReportType";

CREATE TYPE "ReportType" AS ENUM ('Application', 'Driver', 'Rider');

DROP TYPE IF EXISTS "ReportStatus";

CREATE TYPE "ReportStatus" AS ENUM ('Pending', 'Resolved', 'Dismissed');

DROP TYPE IF EXISTS "RideStatus";
CREATE TYPE "RideStatus" AS ENUM ('Pending', 'Accepted', 'Completed', 'Cancelled by Driver', 'Cancelled by Rider');

DROP TYPE IF EXISTS "TransactionStatus";

CREATE TYPE "TransactionStatus" AS ENUM ('Pending', 'Completed', 'Refunded', 'Failed');