export interface ActivityData {
  type: "link" | "multiple" | null
  content: string | ActivityProgress[]
}

export interface ActivityProgress {
  name: string
  value: number
  unit: string
}

export interface Activity {
  id: string
  user_id: string
  category: "Workout" | "Learning" | "Creating Something"
  description: string
  activity_data: ActivityData
  duration_minutes?: number
  goal_id?: string
  sub_goal_id?: string
  goal_progress_percentage?: number
  timestamp: string
  created_at: string
}

export interface SubGoal {
  id: string
  name: string
  description?: string
  target_count: number
  is_completed: boolean
}

export interface Goal {
  id: string
  user_id: string
  title: string
  description?: string
  category: "Workout" | "Learning" | "Creating Something"
  type: "monthly" | "yearly"
  target_count: number
  sub_goals: SubGoal[]
  created_at: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: "streak" | "activity" | "goal" | "social" | "special"
  criteria: {
    type: "count" | "streak" | "percentage" | "time"
    target: number
    category?: "Workout" | "Learning" | "Creating Something"
  }
  rarity: "common" | "rare" | "epic" | "legendary"
  xp_reward: number
}

export interface UserAchievement {
  id: string
  user_id: string
  achievement_id: string
  earned_at: string
  progress?: number
  is_shared?: boolean
}

export interface UserStats {
  id: string
  user_id: string
  total_xp: number
  level: number
  current_streak: number
  longest_streak: number
  total_activities: number
  workout_count: number
  learning_count: number
  creating_count: number
  goals_completed: number
  achievements_earned: number
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  full_name?: string
  email_verified?: boolean
  stats?: UserStats
  achievements?: UserAchievement[]
}

export interface ContributionData {
  date: string
  count: number
}
