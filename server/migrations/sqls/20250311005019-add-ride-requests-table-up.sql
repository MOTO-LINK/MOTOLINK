CREATE TABLE IF NOT EXISTS "RideRequests" (
	"RideRequestID" serial PRIMARY KEY,
	"RiderID" INT,
	"DriverID" INT,
	"StartLocation" text NOT NULL,
	"EndLocation" text NOT NULL,
	"DriverLocation" text NOT NULL,
	"RideType" "VehicleType" NOT NULL,
	"Status" "RideStatus" NOT NULL DEFAULT 'Pending',
	"RequestTime" timestamp NOT NULL,
	"EstimatedFee" SMALLINT NOT NULL,
	"Distance" INT NOT NULL,
	CONSTRAINT "FK_Request_Rider" FOREIGN KEY ("RiderID") REFERENCES "Users" ("UserID") ON DELETE CASCADE,
	CONSTRAINT "FK_Request_Driver" FOREIGN KEY ("DriverID") REFERENCES "Users" ("UserID") ON DELETE CASCADE
);