-- Add sub_goals functionality to goals and activities tables

-- First, add new columns to existing tables
ALTER TABLE goals 
ADD COLUMN title TEXT,
ADD COLUMN description TEXT,
ADD COLUMN sub_goals JSONB DEFAULT '[]';

-- Add sub_goal_id to activities table
ALTER TABLE activities 
ADD COLUMN sub_goal_id TEXT;

-- Update existing goals to have a title (use category as fallback)
UPDATE goals 
SET title = category || ' Goal'
WHERE title IS NULL;

-- Make title required for new records
ALTER TABLE goals 
ALTER COLUMN title SET NOT NULL;

-- Add comments for clarity
COMMENT ON COLUMN goals.sub_goals IS 'Array of sub-goals with structure: [{"id": "string", "name": "string", "description": "string", "target_count": number, "is_completed": boolean}]';
COMMENT ON COLUMN activities.sub_goal_id IS 'Reference to a sub-goal ID within the related goal';

-- Create index for better performance on sub_goal_id lookups
CREATE INDEX IF NOT EXISTS idx_activities_sub_goal_id ON activities(sub_goal_id);
