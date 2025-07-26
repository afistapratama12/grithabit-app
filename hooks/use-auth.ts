import { useQuery } from '@tanstack/react-query'
import { getCurrentUser, getCurrentSession } from '@/lib/auth'

export function useCurrentUser() {
  return useQuery({
    queryKey: ['auth', 'currentUser'],
    queryFn: async () => {
      const { user, error } = await getCurrentUser()
      
      if (error) {
        console.error('useCurrentUser: Error fetching user:', error)
        throw error
      }
      
      if (!user) {
        throw new Error('No user found')
      }
      return user
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  })
}

export function useCurrentSession() {
  return useQuery({
    queryKey: ['auth', 'currentSession'],
    queryFn: async () => {
      const { session, error } = await getCurrentSession()
      
      if (error) {
        console.error('useCurrentSession: Error fetching session:', error)
        throw error
      }
      
      if (!session) {
        throw new Error('No session found')
      }
      
      return session
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  })
}
