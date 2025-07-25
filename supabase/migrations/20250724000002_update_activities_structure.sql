-- Update activities table to support new structure
ALTER TABLE activities 
ADD COLUMN activity_data JSONB,
ADD COLUMN duration_minutes INTEGER,
ADD COLUMN goal_id UUID REFERENCES goals(id),
ADD COLUMN goal_progress_percentage INTEGER CHECK (goal_progress_percentage >= 0 AND goal_progress_percentage <= 100);

-- Create index for better performance
CREATE INDEX idx_activities_goal_id ON activities(goal_id);
CREATE INDEX idx_activities_activity_data ON activities USING GIN (activity_data);

-- Update existing activities to have basic activity_data structure
UPDATE activities 
SET activity_data = jsonb_build_object(
  'type', 'simple',
  'content', description
)
WHERE activity_data IS NULL;

-- Make activity_data NOT NULL after updating existing records
ALTER TABLE activities ALTER COLUMN activity_data SET NOT NULL;
