CREATE TABLE IF NOT EXISTS "Drivers" (
	"DriverID" INT,
	"NationalID" char(14) NOT NULL UNIQUE,
	"VehicleType" "VehicleType" NOT NULL,
	"VehicleRegNumber" varchar(7) NOT NULL UNIQUE,
	"Rating" FLOAT NOT NULL DEFAULT 0,
	"VerificationStatus" "VerificationStatus" NOT NULL DEFAULT 'Pending',
	CONSTRAINT "FK_Drivers_Users" FOREIGN KEY ("DriverID") REFERENCES "Users"("UserID") ON DELETE CASCADE
)