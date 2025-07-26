"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { loginSchema, registerSchema, verificationSchema } from "@/lib/validations"
import { signIn, sendRegistrationOTP, verifyOTPAndCreateUser, resendRegistrationOTP, getCurrentSession } from "@/lib/auth"
import { Loader2 } from "lucide-react"
import { LoginForm, RegisterForm, VerificationForm } from "./types"

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showVerification, setShowVerification] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [isResending, setIsResending] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const verificationForm = useForm<VerificationForm>({
    resolver: zodResolver(verificationSchema),
  })


  const onLogin = async (data: LoginForm) => {
    setIsLoading(true)
    try {
      const { data: authData, error } = await signIn(data.email, data.password)

      if (error) {
        console.error('Login error:', error)
        toast({
          title: "Login Failed",
          description: error.message || "Invalid email or password",
          variant: "destructive",
        })
        return
      }

      if (!authData || !authData.user) {
        toast({
          title: "Login Failed",
          description: "No user data received",
          variant: "destructive",
        })
        return
      }

      // Check if email is confirmed
      if (!authData.user.email_confirmed_at) {
        setUserEmail(data.email)
        setShowVerification(true)
        toast({
          title: "Email verification required",
          description: "Please check your email for the verification code.",
        })
        return
      }

      // Verify session is set
      const { session } = await getCurrentSession()
      if (!session) {
        console.error('No session found after login')
        toast({
          title: "Session Error",
          description: "Please try logging in again",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Welcome back!",
        description: `Successfully logged in as ${authData.user.email}`,
      })
      
      // Small delay to ensure session is properly set before redirect
      setTimeout(() => {
        router.push("/dashboard")
      }, 100)
      
    } catch (error) {
      console.error('Unexpected login error:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onRegister = async (data: RegisterForm) => {
    setIsLoading(true)
    try {
      const result = await sendRegistrationOTP(data.email, data.password, data.fullName)

      if (!result.success) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      // Store email and show verification form
      setUserEmail(data.email)
      setShowVerification(true)
      toast({
        title: "Check your email!",
        description: `We've sent a 6-digit verification code to ${data.email}. Please check your inbox and enter the code below.`,
      })

      // For development - show OTP in toast (remove in production)
      if (result.developmentOTP) {
        toast({
          title: "Development Mode",
          description: `Your OTP is: ${result.developmentOTP}`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred during registration",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onVerification = async (data: VerificationForm) => {
    setIsLoading(true)
    try {
      const result = await verifyOTPAndCreateUser(userEmail, data.pin)

      if (!result.success) {
        toast({
          title: "Verification failed",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      // Success - account created
      if (result.requiresManualLogin) {
        toast({
          title: "Account created successfully!",
          description: result.message + " Please use the Sign In tab to continue.",
        })
        
        // Reset verification form and hide verification step
        setShowVerification(false)
        setUserEmail("")
        verificationForm.reset()
        registerForm.reset()
        return
      }

      // Success - account created and user signed in
      toast({
        title: "Account created successfully!",
        description: "Welcome to Grithabit! Your account has been activated.",
      })
      
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred during verification",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setIsResending(true)
    try {
      const result = await resendRegistrationOTP(userEmail)

      if (!result.success) {
        toast({
          title: "Failed to resend code",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Code resent!",
        description: `A new verification code has been sent to ${userEmail}`,
      })

      // For development - show new OTP in toast (remove in production)
      if (result.developmentOTP) {
        toast({
          title: "Development Mode",
          description: `Your new OTP is: ${result.developmentOTP}`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend verification code",
        variant: "destructive",
      })
    } finally {
      setIsResending(false)
    }
  }

  if (showVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">Grithabit</CardTitle>
            <CardDescription>
              We've sent a 6-digit verification code to <br />
              <span className="font-semibold text-gray-900">{userEmail}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={verificationForm.handleSubmit(onVerification)} className="space-y-4">
              <div>
                <Label htmlFor="pin">Verification Code</Label>
                <Input 
                  id="pin" 
                  type="text" 
                  placeholder="Enter 6-digit code" 
                  maxLength={6} 
                  className="text-center text-lg tracking-widest"
                  {...verificationForm.register("pin")} 
                />
                {verificationForm.formState.errors.pin && (
                  <p className="text-sm text-red-500 mt-1">{verificationForm.formState.errors.pin.message}</p>
                )}
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify Email
              </Button>
              
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  Didn't receive the code?
                </p>
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full" 
                  onClick={handleResendCode}
                  disabled={isResending}
                >
                  {isResending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Resend Code
                </Button>
              </div>
              
              <Button 
                type="button"
                variant="ghost" 
                className="w-full text-sm" 
                onClick={() => {
                  setShowVerification(false)
                  setUserEmail("")
                  verificationForm.reset()
                }}
              >
                Back to Register
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">Grithabit</CardTitle>
          <CardDescription>Track your daily progress in workout, learning, and creating</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.com" {...loginForm.register("email")} />
                  {loginForm.formState.errors.email && (
                    <p className="text-sm text-red-500 mt-1">{loginForm.formState.errors.email.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="••••••••" {...loginForm.register("password")} />
                  {loginForm.formState.errors.password && (
                    <p className="text-sm text-red-500 mt-1">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" type="text" placeholder="John Doe" {...registerForm.register("fullName")} />
                  {registerForm.formState.errors.fullName && (
                    <p className="text-sm text-red-500 mt-1">{registerForm.formState.errors.fullName.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="registerEmail">Email</Label>
                  <Input
                    id="registerEmail"
                    type="email"
                    placeholder="your@email.com"
                    {...registerForm.register("email")}
                  />
                  {registerForm.formState.errors.email && (
                    <p className="text-sm text-red-500 mt-1">{registerForm.formState.errors.email.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="registerPassword">Password</Label>
                  <Input
                    id="registerPassword"
                    type="password"
                    placeholder="••••••••"
                    {...registerForm.register("password")}
                  />
                  {registerForm.formState.errors.password && (
                    <p className="text-sm text-red-500 mt-1">{registerForm.formState.errors.password.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
