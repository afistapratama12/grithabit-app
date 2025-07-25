export interface DatabaseResponse<T> {
  data: T | null;
  error: any; // Supabase error type
}

// Activity types
export interface ActivityInput {
  category: "Workout" | "Learning" | "Creating Something";
  description: string;
  activity_data: WorkoutData | LearningData | CreatingData;
  duration_minutes?: number;
  goal_id?: string;
  sub_goal_id?: string;
  goal_progress_percentage?: number;
  timestamp: string;
}

export interface Activity extends ActivityInput {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

// Activity data types based on category
export interface WorkoutData {
  exercise_type?: string;
  intensity?: "Low" | "Medium" | "High";
  sets?: number;
  reps?: number;
  weight?: number;
  distance?: number; // for running/cycling
  calories_burned?: number;
}

export interface LearningData {
  subject?: string;
  skill_level?: "Beginner" | "Intermediate" | "Advanced";
  resource_type?: "Book" | "Video" | "Course" | "Practice" | "Other";
  pages_read?: number;
  videos_watched?: number;
  exercises_completed?: number;
}

export interface CreatingData {
  project_type?: string;
  tools_used?: string[];
  progress_percentage?: number;
  lines_of_code?: number; // for coding projects
  words_written?: number; // for writing projects
  features_completed?: string[];
}

// Goal types
export interface SubGoal {
  id: string;
  name: string;
  description?: string;
  target_count: number;
  is_completed: boolean;
}

export interface GoalInput {
  title: string;
  description?: string;
  category: "Workout" | "Learning" | "Creating Something";
  type: "monthly" | "yearly";
  target_count: number;
  sub_goals: Omit<SubGoal, "id" | "is_completed">[];
}

export interface Goal extends Omit<GoalInput, "sub_goals"> {
  id: string;
  user_id: string;
  sub_goals: SubGoal[];
  current_count: number;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

// User Stats types
export interface UserStats {
  id: string;
  user_id: string;
  total_xp: number;
  level: number;
  current_streak: number;
  longest_streak: number;
  total_activities: number;
  workout_count: number;
  learning_count: number;
  creating_count: number;
  goals_completed: number;
  achievements_earned: number;
  created_at: string;
  updated_at: string;
}

export interface UserStatsInput {
  user_id: string;
  total_xp: number;
  level: number;
  current_streak: number;
  longest_streak: number;
  total_activities: number;
  workout_count: number;
  learning_count: number;
  creating_count: number;
  goals_completed: number;
  achievements_earned: number;
}

// Achievement types
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "activity" | "streak" | "xp" | "goal" | "special";
  xp_reward: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  requirements: AchievementRequirement;
}

export interface AchievementRequirement {
  type:
    | "total_activities"
    | "streak"
    | "total_xp"
    | "level"
    | "category_count"
    | "goals_completed";
  count?: number;
  category?: "Workout" | "Learning" | "Creating Something";
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  is_shared: boolean;
}

// Function return types
export interface StatsUpdateResult {
  newAchievements: Achievement[];
  totalXpGained: number;
}

export interface StreakData {
  current: number;
  longest: number;
}
