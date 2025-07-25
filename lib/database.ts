'use server'

import { createClient } from "./supabase/server"
import type { Activity, Goal, ContributionData, UserStats, UserAchievement, Achievement } from "./types"
import type { 
	ActivityInput, 
	GoalInput, 
	DatabaseResponse
} from "./supabase/types"
import { calculateActivityXp, checkAchievements, calculateStreak, ACHIEVEMENTS } from "./achievements"

// Custom type for our specific StatsUpdateResult using Achievement from lib/types.ts
interface StatsUpdateResult {
	newAchievements: Achievement[];
	totalXpGained: number;
}

export async function createActivity(activityInput: ActivityInput): Promise<DatabaseResponse<Activity>> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  // Create the activity
  const { data: activity, error: activityError } = await supabase
    .from("activities")
    .insert({
      ...activityInput,
      user_id: user.id,
    })
    .select()
    .single()

  if (activityError) return { data: activity, error: activityError }

  // Update user stats and check for achievements
  try {
    await updateUserStatsAndCheckAchievements(user.id, activityInput)
  } catch (error) {
    console.error("Error updating stats:", error)
    // Don't fail the activity creation if stats update fails
  }

  return { data: activity, error: null }
}

export async function getActivities(userId: string): Promise<DatabaseResponse<Activity[]>> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .eq("user_id", userId)
    .order("timestamp", { ascending: false })

  return { data, error }
}

export async function createGoal(goalInput: GoalInput): Promise<DatabaseResponse<Goal>> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  // Transform sub_goals to include id and is_completed
  const transformedSubGoals = goalInput.sub_goals.map((subGoal, index) => ({
    id: `${Date.now()}-${index}`, // Simple ID generation
    name: subGoal.name,
    description: subGoal.description,
    target_count: subGoal.target_count,
    is_completed: false,
  }))

  const goalData = {
    ...goalInput,
    sub_goals: transformedSubGoals,
    user_id: user.id,
  }

  const { data, error } = await supabase
    .from("goals")
    .insert(goalData)
    .select()
    .single()

  return { data, error }
}

export async function getGoals(userId: string): Promise<DatabaseResponse<Goal[]>> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  return { data, error }
}

export async function getContributionData(userId: string, days: number): Promise<ContributionData[]> {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days + 1)
  startDate.setHours(0, 0, 0, 0)

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("activities")
    .select("timestamp")
    .eq("user_id", userId)
    .gte("timestamp", startDate.toISOString())

  if (error || !data) {
    console.error("Error fetching contribution data:", error)
    return []
  }

  // Group activities by date and count them
  const dateCountMap: { [key: string]: number } = {}

  // Initialize all dates with 0 count
  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateString = date.toISOString().split("T")[0]
    dateCountMap[dateString] = 0
  }

  // Count activities for each date
  data.forEach((activity) => {
    const date = new Date(activity.timestamp).toISOString().split("T")[0]
    if (dateCountMap[date] !== undefined) {
      dateCountMap[date]++
    }
  })

  // Convert to array format
  return Object.entries(dateCountMap)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

// User Stats Management
export async function getUserStats(userId: string): Promise<DatabaseResponse<UserStats>> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("user_stats")
    .select("*")
    .eq("user_id", userId)
    .single()

    // allow empty
  if (error && error.code !== 'PGRST116') { // PGRST116 means no data found
    console.error("Error fetching user stats:", error)
    return { data: null, error }
  }

  return { data, error }
}

export async function initializeUserStats(userId: string): Promise<DatabaseResponse<UserStats>> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("user_stats")
    .insert({
      user_id: userId,
      total_xp: 0,
      level: 1,
      current_streak: 0,
      longest_streak: 0,
      total_activities: 0,
      workout_count: 0,
      learning_count: 0,
      creating_count: 0,
      goals_completed: 0,
      achievements_earned: 0,
    })
    .select()
    .single()

  return { data, error }
}

export async function updateUserStatsAndCheckAchievements(
  userId: string, 
  newActivity: {
    category: "Workout" | "Learning" | "Creating Something"
    goal_id?: string
    duration_minutes?: number
  }
): Promise<StatsUpdateResult> {
  const supabase = await createClient()

  // Get current stats
  let { data: stats, error: statsError } = await getUserStats(userId)
  
  // Initialize stats if they don't exist
  if (statsError?.code === 'PGRST116' || !stats) {
    const { data: newStats, error: initError } = await initializeUserStats(userId)
    if (initError) throw initError
    stats = newStats
  }

  if (!stats) throw new Error("Failed to get user stats")

  // Get all activities to calculate streak
  const { data: activities } = await getActivities(userId)
  const streaks = calculateStreak(activities || [])

  // Calculate XP for this activity
  const activityXp = calculateActivityXp(newActivity as Activity, !!newActivity.goal_id)

  // Update stats
  const updatedStats = {
    total_xp: stats.total_xp + activityXp,
    level: Math.floor((stats.total_xp + activityXp) / 100) + 1,
    current_streak: streaks.current,
    longest_streak: Math.max(stats.longest_streak, streaks.longest),
    total_activities: stats.total_activities + 1,
    workout_count: stats.workout_count + (newActivity.category === "Workout" ? 1 : 0),
    learning_count: stats.learning_count + (newActivity.category === "Learning" ? 1 : 0),
    creating_count: stats.creating_count + (newActivity.category === "Creating Something" ? 1 : 0),
    updated_at: new Date().toISOString(),
  }

  // Update stats in database
  const { error: updateError } = await supabase
    .from("user_stats")
    .update(updatedStats)
    .eq("user_id", userId)

  if (updateError) throw updateError

  // Check for new achievements
  const { data: userAchievements } = await getUserAchievements(userId)
  const earnedIds = userAchievements?.map(ua => ua.achievement_id) || []
  
  const newAchievements = checkAchievements(
    { ...stats, ...updatedStats } as UserStats,
    ACHIEVEMENTS,
    earnedIds
  )

  // Award new achievements
  for (const achievement of newAchievements) {
    await awardAchievement(userId, achievement.id)
    
    // Add XP bonus for achievement
    await supabase
      .from("user_stats")
      .update({ 
        total_xp: updatedStats.total_xp + achievement.xp_reward,
        achievements_earned: stats.achievements_earned + 1
      })
      .eq("user_id", userId)
  }

  return { newAchievements, totalXpGained: activityXp + newAchievements.reduce((sum, a) => sum + a.xp_reward, 0) }
}

// Achievement Management
export async function getUserAchievements(userId: string): Promise<DatabaseResponse<UserAchievement[]>> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("user_achievements") 
    .select("*")
    .eq("user_id", userId)
    .order("earned_at", { ascending: false })

  return { data, error }
}

export async function awardAchievement(userId: string, achievementId: string): Promise<DatabaseResponse<UserAchievement>> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("user_achievements")
    .insert({
      user_id: userId,
      achievement_id: achievementId,
      earned_at: new Date().toISOString(),
      is_shared: false,
    })
    .select()
    .single()

  return { data, error }
}

export async function markAchievementAsShared(userId: string, achievementId: string): Promise<DatabaseResponse<UserAchievement>> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("user_achievements")
    .update({ is_shared: true })
    .eq("user_id", userId)
    .eq("achievement_id", achievementId)

  return { data, error }
}