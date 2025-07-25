import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getActivities, getGoals, getContributionData, getUserStats, getUserAchievements } from '@/lib/database'
import type { Activity, Goal, ContributionData, UserStats, UserAchievement } from '@/lib/types'
import { getCurrentUser } from '@/lib/auth'

// Query keys
// export const queryKeys = {
//   activities: (userId: string) => ['activities', userId],
//   goals: (userId: string) => ['goals', userId],
//   contribution: (userId: string, days: number) => ['contribution', userId, days],
//   userStats: (userId: string) => ['userStats', userId],
//   userAchievements: (userId: string) => ['userAchievements', userId],
// }

// Activities hooks
export function useActivities(userId: string | null) {
  return useQuery({
    queryKey: ['activities', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required')
      const result = await getActivities(userId)
      if (!result.data) throw new Error(result.error?.message || 'Failed to fetch activities')
      return result.data
    },
    enabled: !!userId,
  })
}

// Goals hooks
export function useGoals(userId: string | null) {
  return useQuery({
    queryKey: ['goals', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required')
      const result = await getGoals(userId)
      if (!result.data) throw new Error(result.error?.message || 'Failed to fetch goals')
      return result.data
    },
    enabled: !!userId,
  })
}

// Contribution data hooks
export function useContribution(userId: string | null, timeRange: 'weekly' | 'monthly') {
  const days = timeRange === 'weekly' ? 7 : 30
  
  return useQuery({
    queryKey: ['contribution', userId, days],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required')
      try {
        const result = await getContributionData(userId, days)
        return result
      } catch (error) {
        console.error('Error loading contribution data:', error)
        // Generate mock data for demo
        return generateMockContributionData(days)
      }
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Mock data generator function
function generateMockContributionData(days: number): ContributionData[] {
  const data: ContributionData[] = []
  const today = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    data.push({
      date: date.toISOString().split('T')[0],
      count: Math.floor(Math.random() * 8) // 0-7 activities
    })
  }
  
  return data
}

// User Stats hooks
export function useUserStats(userId: string | null) {
  return useQuery({
    queryKey: ['userStats', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required')
      const result = await getUserStats(userId)
      if (result.error && result.error.code !== 'PGRST116') {
        throw new Error(result.error.message || 'Failed to fetch user stats')
      }
      return result.data
    },
    enabled: !!userId,
  })
}

// User Achievements hooks
export function useUserAchievements(userId: string | null) {
  return useQuery({
    queryKey: ['userAchievements', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required')
      const result = await getUserAchievements(userId)
      if (!result.data) throw new Error(result.error?.message || 'Failed to fetch achievements')
      return result.data
    },
    enabled: !!userId,
  })
}

// Invalidate queries helper
export function useInvalidateQueries() {
  const queryClient = useQueryClient()
  
  return {
    invalidateActivities: (userId: string) => 
      queryClient.invalidateQueries({ queryKey: ['activities', userId] }),
    invalidateGoals: (userId: string) => 
      queryClient.invalidateQueries({ queryKey: ['goals', userId] }),
    invalidateContribution: (userId: string) => 
      queryClient.invalidateQueries({ 
        queryKey: ['contribution', userId]
       }),
    invalidateUserStats: (userId: string) => 
      queryClient.invalidateQueries({ queryKey: ['userStats', userId] }),
    invalidateUserAchievements: (userId: string) => 
      queryClient.invalidateQueries({ queryKey: ['userAchievements', userId] }),
    invalidateAll: (userId: string) => {
      queryClient.invalidateQueries({ queryKey: ['activities', userId] })
      queryClient.invalidateQueries({ queryKey: ['goals', userId] })
      queryClient.invalidateQueries({ queryKey: ['contribution', userId] })
      queryClient.invalidateQueries({ queryKey: ['userStats', userId] })
      queryClient.invalidateQueries({ queryKey: ['userAchievements', userId] })
    }
  }
}
