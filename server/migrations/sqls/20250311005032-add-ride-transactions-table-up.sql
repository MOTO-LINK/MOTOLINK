CREATE TABLE IF NOT EXISTS "RideTransactions" (
	"TransactionID" serial PRIMARY KEY,
	"RequestID" INT,
	"DriverID" INT,
	"RiderID" INT,
	"StartTime" timestamp NOT NULL,
	"EndTime" timestamp NOT NULL,
	"StartLocation" text NOT NULL,
	"EndLocation" text NOT NULL,
	"ActualDistance" INT NOT NULL,
	"TotalFee" SMALLINT NOT NULL,
	"Status" "TransactionStatus" NOT NULL DEFAULT 'Pending',
	CONSTRAINT "FK_Transaction_Request" FOREIGN KEY ("RequestID") REFERENCES "RideRequests" ("RideRequestID") ON DELETE CASCADE,
	CONSTRAINT "FK_Transaction_Driver" FOREIGN KEY ("DriverID") REFERENCES "Users" ("UserID") ON DELETE CASCADE,
	CONSTRAINT "FK_Transaction_Rider" FOREIGN KEY ("RiderID") REFERENCES "Users" ("UserID") ON DELETE CASCADE
);