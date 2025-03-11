CREATE TABLE IF NOT EXISTS "Ratings" (
	"RatingID" serial PRIMARY KEY,
	"RatingUserID" INT,
	"RatedUserID" INT,
	"RideTransactionID" INT,
	"Rating" INT NOT NULL,
	"Feedback" text NOT NULL,
	CONSTRAINT "FK_Rating_RatingUser" FOREIGN KEY ("RatingUserID") REFERENCES "Users" ("UserID") ON DELETE CASCADE,
	CONSTRAINT "FK_Rating_RatedUser" FOREIGN KEY ("RatedUserID") REFERENCES "Users" ("UserID") ON DELETE CASCADE,
	CONSTRAINT "FK_Rating_RideTransaction" FOREIGN KEY ("RideTransactionID") REFERENCES "RideTransactions" ("TransactionID") ON DELETE CASCADE
);