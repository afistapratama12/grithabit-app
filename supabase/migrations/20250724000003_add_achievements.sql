-- Create achievement system tables

-- User stats table
CREATE TABLE user_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    total_xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    total_activities INTEGER DEFAULT 0,
    workout_count INTEGER DEFAULT 0,
    learning_count INTEGER DEFAULT 0,
    creating_count INTEGER DEFAULT 0,
    goals_completed INTEGER DEFAULT 0,
    achievements_earned INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id)
);

-- User achievements table
CREATE TABLE user_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id TEXT NOT NULL,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    progress INTEGER DEFAULT 100,
    is_shared BOOLEAN DEFAULT FALSE,
    UNIQUE(user_id, achievement_id)
);

-- Create indexes for better performance
CREATE INDEX idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX idx_user_stats_level ON user_stats(level);
CREATE INDEX idx_user_stats_total_xp ON user_stats(total_xp);

CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_earned_at ON user_achievements(earned_at);
CREATE INDEX idx_user_achievements_achievement_id ON user_achievements(achievement_id);

-- Enable Row Level Security
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own stats" ON user_stats
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own stats" ON user_stats
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats" ON user_stats
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own achievements" ON user_achievements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own achievements" ON user_achievements
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements" ON user_achievements
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add comments
COMMENT ON TABLE user_stats IS 'User statistics and progression data';
COMMENT ON TABLE user_achievements IS 'User earned achievements';
COMMENT ON COLUMN user_achievements.achievement_id IS 'Reference to predefined achievement ID';
COMMENT ON COLUMN user_achievements.progress IS 'Achievement progress percentage (0-100)';
COMMENT ON COLUMN user_achievements.is_shared IS 'Whether user has shared this achievement on social media';
