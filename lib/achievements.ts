import type { Achievement, UserStats, Activity, Goal } from './types'

// Predefined achievements untuk MVP
export const ACHIEVEMENTS: Achievement[] = [
  // Beginner achievements
  {
    id: "first-step",
    name: "First Steps",
    description: "Complete your very first activity",
    icon: "🎯",
    category: "activity",
    criteria: { type: "count", target: 1 },
    rarity: "common",
    xp_reward: 50
  },
  {
    id: "goal-setter",
    name: "Goal Setter", 
    description: "Create your first goal",
    icon: "🎪",
    category: "goal",
    criteria: { type: "count", target: 1 },
    rarity: "common",
    xp_reward: 25
  },

  // Activity based achievements
  {
    id: "learning-machine",
    name: "Learning Machine",
    description: "Complete 10 learning activities",
    icon: "🧠",
    category: "activity",
    criteria: { type: "count", target: 10, category: "Learning" },
    rarity: "common",
    xp_reward: 100
  },
  {
    id: "fitness-warrior",
    name: "Fitness Warrior",
    description: "Complete 10 workout activities",
    icon: "💪",
    category: "activity",
    criteria: { type: "count", target: 10, category: "Workout" },
    rarity: "common",
    xp_reward: 100
  },
  {
    id: "creator-spirit",
    name: "Creator Spirit",
    description: "Complete 10 creative activities",
    icon: "🎨",
    category: "activity",
    criteria: { type: "count", target: 10, category: "Creating Something" },
    rarity: "common",
    xp_reward: 100
  },

  // Streak achievements
  {
    id: "streak-starter",
    name: "Streak Starter",
    description: "Maintain a 7-day activity streak",
    icon: "🔥",
    category: "streak",
    criteria: { type: "streak", target: 7 },
    rarity: "rare",
    xp_reward: 200
  },
  {
    id: "streak-master",
    name: "Streak Master",
    description: "Maintain a 30-day activity streak",
    icon: "⚡",
    category: "streak",
    criteria: { type: "streak", target: 30 },
    rarity: "epic",
    xp_reward: 500
  },

  // Goal achievements
  {
    id: "goal-crusher",
    name: "Goal Crusher",
    description: "Complete your first goal",
    icon: "🏆",
    category: "goal",
    criteria: { type: "count", target: 1 },
    rarity: "rare",
    xp_reward: 300
  },
  {
    id: "goal-machine",
    name: "Goal Machine", 
    description: "Complete 5 goals",
    icon: "🎖️",
    category: "goal",
    criteria: { type: "count", target: 5 },
    rarity: "epic",
    xp_reward: 750
  },

  // Volume achievements
  {
    id: "busy-bee",
    name: "Busy Bee",
    description: "Complete 50 activities total",
    icon: "🐝",
    category: "activity",
    criteria: { type: "count", target: 50 },
    rarity: "rare",
    xp_reward: 400
  },
  {
    id: "productivity-master",
    name: "Productivity Master",
    description: "Complete 100 activities total",
    icon: "⭐",
    category: "activity", 
    criteria: { type: "count", target: 100 },
    rarity: "epic",
    xp_reward: 800
  }
]

export const RARITY_COLORS = {
  common: "bg-gray-100 text-gray-800 border-gray-300",
  rare: "bg-blue-100 text-blue-800 border-blue-300", 
  epic: "bg-purple-100 text-purple-800 border-purple-300",
  legendary: "bg-yellow-100 text-yellow-800 border-yellow-300"
}

export const XP_PER_LEVEL = 100

// Calculate user level from XP
export function calculateLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1
}

// Calculate XP needed for next level
export function getXpForNextLevel(currentXp: number): number {
  const currentLevel = calculateLevel(currentXp)
  return (currentLevel * XP_PER_LEVEL) - currentXp
}

// Calculate XP reward for activity
export function calculateActivityXp(
  activity: Omit<Activity, 'id' | 'user_id' | 'created_at'>, 
  isGoalRelated: boolean = false
): number {
  let baseXp = 10

  // Duration bonus
  if (activity.duration_minutes) {
    baseXp += Math.min(Math.floor(activity.duration_minutes / 15) * 5, 30) // Max 30 bonus
  }

  // Goal relation bonus
  if (isGoalRelated) {
    baseXp += 10
  }

  // Activity type bonus
  if (activity.activity_data.type === "multiple") {
    baseXp += 5 // Detailed logging bonus
  }

  return baseXp
}

// Check which achievements user has earned
export function checkAchievements(
  userStats: UserStats,
  achievements: Achievement[],
  earnedAchievementIds: string[]
): Achievement[] {
  return achievements.filter(achievement => {
    // Skip if already earned
    if (earnedAchievementIds.includes(achievement.id)) {
      return false
    }

    const { criteria } = achievement

    switch (criteria.type) {
      case "count":
        if (criteria.category) {
          // Category-specific count
          switch (criteria.category) {
            case "Workout":
              return userStats.workout_count >= criteria.target
            case "Learning":
              return userStats.learning_count >= criteria.target
            case "Creating Something":
              return userStats.creating_count >= criteria.target
          }
        } else {
          // Total activities or goals
          if (achievement.category === "goal") {
            return userStats.goals_completed >= criteria.target
          } else {
            return userStats.total_activities >= criteria.target
          }
        }
        break

      case "streak":
        return userStats.current_streak >= criteria.target || 
               userStats.longest_streak >= criteria.target

      default:
        return false
    }
  })
}

// Calculate current streak
export function calculateStreak(activities: Activity[]): { current: number, longest: number } {
  if (activities.length === 0) return { current: 0, longest: 0 }

  // Sort activities by date (newest first)
  const sortedActivities = activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  // Group by date
  const activityDates = Array.from(new Set(
    sortedActivities.map(activity => 
      new Date(activity.timestamp).toISOString().split('T')[0]
    )
  )).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 0

  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  // Calculate current streak
  for (let i = 0; i < activityDates.length; i++) {
    const currentDate = activityDates[i]
    
    if (i === 0) {
      // First date should be today or yesterday to have a current streak
      if (currentDate === today || currentDate === yesterday) {
        currentStreak = 1
        tempStreak = 1
      } else {
        break
      }
    } else {
      const prevDate = activityDates[i - 1]
      const daysDiff = (new Date(prevDate).getTime() - new Date(currentDate).getTime()) / (1000 * 60 * 60 * 24)
      
      if (daysDiff === 1) {
        currentStreak++
        tempStreak++
      } else {
        break
      }
    }
  }

  // Calculate longest streak
  tempStreak = 0
  for (let i = 0; i < activityDates.length; i++) {
    if (i === 0) {
      tempStreak = 1
    } else {
      const prevDate = activityDates[i - 1]
      const currentDate = activityDates[i]
      const daysDiff = (new Date(prevDate).getTime() - new Date(currentDate).getTime()) / (1000 * 60 * 60 * 24)
      
      if (daysDiff === 1) {
        tempStreak++
      } else {
        longestStreak = Math.max(longestStreak, tempStreak)
        tempStreak = 1
      }
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak)

  return { current: currentStreak, longest: longestStreak }
}
