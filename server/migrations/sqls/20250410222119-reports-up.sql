CREATE TABLE IF NOT EXISTS reports (
	report_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	reporter_id UUID REFERENCES users(user_id),
	reported_user_id UUID REFERENCES users(user_id),
	report_type report_type NOT NULL,
	description TEXT NOT NULL,
	report_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	status report_status DEFAULT 'pending',
	resolution_notes TEXT,
	resolved_by UUID REFERENCES users(user_id),
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_reports_updated_at BEFORE
UPDATE
	ON reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();