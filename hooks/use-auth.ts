import { useQuery } from '@tanstack/react-query'
import { getCurrentUser, getCurrentSession } from '@/lib/auth'

export function useCurrentUser() {
  return useQuery({
    queryKey: ['auth', 'currentUser'],
    queryFn: async () => {
      console.log('useCurrentUser: Fetching user...')
      const { user, error } = await getCurrentUser()
      
      if (error) {
        console.error('useCurrentUser: Error fetching user:', error)
        throw error
      }
      
      if (!user) {
        console.log('useCurrentUser: No user found')
        throw new Error('No user found')
      }
      
      console.log('useCurrentUser: User found:', user.email)
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
      console.log('useCurrentSession: Fetching session...')
      const { session, error } = await getCurrentSession()
      
      if (error) {
        console.error('useCurrentSession: Error fetching session:', error)
        throw error
      }
      
      if (!session) {
        console.log('useCurrentSession: No session found')
        throw new Error('No session found')
      }
      
      console.log('useCurrentSession: Session found for user:', session.user?.email)
      return session
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  })
}
