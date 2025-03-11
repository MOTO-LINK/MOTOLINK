CREATE TABLE IF NOT EXISTS "Reports" (
	"ReportID" serial PRIMARY KEY,
	"ReporterUserID" INT,
	"ReportedUserID" INT,
	"ReportType" "ReportType" NOT NULL,
	"Description" varchar(2047) NOT NULL,
	"ReportTime" timestamp NOT NULL,
	"Status" "ReportStatus" NOT NULL,
	CONSTRAINT "FK_Reports_Reporter" FOREIGN KEY ("ReporterUserID") REFERENCES "Users" ("UserID") ON DELETE CASCADE,
	CONSTRAINT "FK_Reports_Reported" FOREIGN KEY ("ReportedUserID") REFERENCES "Users" ("UserID") ON DELETE CASCADE
);