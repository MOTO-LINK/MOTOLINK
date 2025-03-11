CREATE TABLE IF NOT EXISTS "Users" (
	"UserID" serial PRIMARY KEY,
	"Name" varchar(255) NOT NULL,
	"Email" varchar(255) NOT NULL,
	"Password" varchar(255) NOT NULL,
	"ProfilePicture" varchar(2047) NOT NULL,
	"UserType" "UserType" NOT NULL,
	"AccountLocked" boolean NOT NULL DEFAULT FALSE
)