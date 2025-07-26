"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { verifyOTPAndCreateUser } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")

  useEffect(() => {
    const emailParam = searchParams.get("email")
    const otpParam = searchParams.get("otp")
    
    if (emailParam) {
      setEmail(emailParam)
    }
    
    if (otpParam) {
      setOtp(otpParam)
      // Auto-verify if OTP is provided in URL
      handleVerify(emailParam || "", otpParam)
    }
  }, [searchParams])

  const handleVerify = async (emailToVerify: string, otpToVerify: string) => {
    if (!emailToVerify || !otpToVerify) {
      toast({
        title: "Missing information",
        description: "Please enter your email and OTP code",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const result = await verifyOTPAndCreateUser(emailToVerify, otpToVerify)

      if (result.success) {
        toast({
          title: "Email verified successfully!",
          description: result.message,
        })
        
        // Redirect based on the result
        if (result.requiresManualLogin) {
          router.push("/auth?message=Account created successfully! Please sign in.")
        } else {
          router.push("/dashboard")
        }
      } else {
        toast({
          title: "Verification failed",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Verification error:', error)
      toast({
        title: "Something went wrong",
        description: "Please try again or contact support.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleVerify(email, otp)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Verify Your Email</CardTitle>
          <CardDescription className="text-center">
            Enter the verification code sent to your email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                Verification Code
              </label>
              <Input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
                required
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !email || !otp}
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Didn't receive the code?{" "}
              <Button
                variant="link"
                className="p-0 h-auto text-sm"
                onClick={() => router.push("/auth")}
              >
                Go back to registration
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading verification page...</p>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
