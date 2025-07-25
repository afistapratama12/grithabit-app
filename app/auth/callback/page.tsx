"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

export default function AuthCallback() {
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const supabase = createClient()
      
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          toast({
            title: "Verification failed",
            description: error.message,
            variant: "destructive",
          })
          router.push("/auth")
          return
        }

        if (data.session) {
          toast({
            title: "Email verified successfully!",
            description: "Welcome to Grithabit! Your account has been activated.",
          })
          router.push("/dashboard")
        } else {
          router.push("/auth")
        }
      } catch (error) {
        console.error('Unexpected error:', error)
        toast({
          title: "Something went wrong",
          description: "Please try again or contact support.",
          variant: "destructive",
        })
        router.push("/auth")
      }
    }

    handleAuthCallback()
  }, [router, toast])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <h2 className="text-lg font-semibold text-gray-900">Verifying your email...</h2>
        <p className="text-gray-600">Please wait while we confirm your account.</p>
      </div>
    </div>
  )
}
