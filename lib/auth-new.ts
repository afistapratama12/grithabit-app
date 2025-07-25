import { supabase } from './supabase'

// Store OTP data temporarily in memory (replace with Redis in production)
interface OTPData {
  otp: string
  expiry: number
  attempts: number
  userData: {
    email: string
    password: string
    fullName: string
  }
}

const otpStorage = new Map<string, OTPData>()

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Send registration OTP
export async function sendRegistrationOTP(email: string, password: string, fullName: string) {
  try {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('auth.users')
      .select('email')
      .eq('email', email)
      .single()
    
    if (existingUser) {
      return { 
        success: false, 
        error: "An account with this email already exists." 
      }
    }
    
    // Generate OTP and store data
    const otp = generateOTP()
    const expiry = Date.now() + (10 * 60 * 1000) // 10 minutes expiry
    
    otpStorage.set(email, {
      otp,
      expiry,
      attempts: 0,
      userData: { email, password, fullName }
    })
    
    // For development - just console.log the OTP
    console.log(`🔐 OTP untuk ${email}: ${otp}`)
    console.log(`📧 Email verifikasi akan dikirim ke: ${email}`)
    console.log(`👤 Nama lengkap: ${fullName}`)
    console.log(`⏰ OTP akan expired dalam 10 menit`)
    
    return { 
      success: true, 
      message: "OTP has been sent to your email",
      // Remove this in production:
      developmentOTP: otp 
    }
    
  } catch (error) {
    console.error('Error sending OTP:', error)
    return { 
      success: false, 
      error: "Failed to send OTP. Please try again." 
    }
  }
}

// Verify OTP and create user account
export async function verifyOTPAndCreateUser(email: string, inputOTP: string) {
  try {
    const stored = otpStorage.get(email)
    
    if (!stored) {
      return { 
        success: false, 
        error: "OTP not found. Please request a new one." 
      }
    }
    
    // Check expiry
    if (Date.now() > stored.expiry) {
      otpStorage.delete(email)
      return { 
        success: false, 
        error: "OTP has expired. Please request a new one." 
      }
    }
    
    // Check attempts (max 3 attempts)
    if (stored.attempts >= 3) {
      otpStorage.delete(email)
      return { 
        success: false, 
        error: "Too many failed attempts. Please request a new OTP." 
      }
    }
    
    // Verify OTP
    if (stored.otp !== inputOTP) {
      stored.attempts += 1
      otpStorage.set(email, stored)
      return { 
        success: false, 
        error: `Invalid OTP. ${3 - stored.attempts} attempts remaining.` 
      }
    }
    
    // OTP is valid - create user account
    const { email: userEmail, password, fullName } = stored.userData
    
    const { data, error } = await supabase.auth.signUp({
      email: userEmail,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: undefined // No email verification needed
      }
    })
    
    if (error) {
      return { 
        success: false, 
        error: error.message 
      }
    }
    
    // Clean up OTP storage
    otpStorage.delete(email)
    
    // Auto sign in the user
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: userEmail,
      password
    })
    
    if (signInError) {
      return { 
        success: false, 
        error: "Account created but failed to sign in. Please try logging in manually." 
      }
    }
    
    return { 
      success: true, 
      data: signInData,
      message: "Account created successfully!" 
    }
    
  } catch (error) {
    console.error('Error verifying OTP:', error)
    return { 
      success: false, 
      error: "An unexpected error occurred. Please try again." 
    }
  }
}

// Resend OTP
export async function resendRegistrationOTP(email: string) {
  try {
    const stored = otpStorage.get(email)
    
    if (!stored) {
      return { 
        success: false, 
        error: "No OTP request found for this email." 
      }
    }
    
    // Generate new OTP
    const newOTP = generateOTP()
    const expiry = Date.now() + (10 * 60 * 1000) // 10 minutes expiry
    
    // Update stored data
    stored.otp = newOTP
    stored.expiry = expiry
    stored.attempts = 0 // Reset attempts
    otpStorage.set(email, stored)
    
    // For development - console.log the new OTP
    console.log(`🔐 OTP baru untuk ${email}: ${newOTP}`)
    console.log(`📧 Email verifikasi baru akan dikirim ke: ${email}`)
    console.log(`👤 Nama lengkap: ${stored.userData.fullName}`)
    console.log(`⏰ OTP akan expired dalam 10 menit`)
    
    return { 
      success: true, 
      message: "New OTP sent to your email",
      // Remove this in production:
      developmentOTP: newOTP 
    }
    
  } catch (error) {
    console.error('Error resending OTP:', error)
    return { 
      success: false, 
      error: "Failed to resend OTP. Please try again." 
    }
  }
}

// Regular sign in function
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

// Sign out function
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// Get current user
export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  return { user, error }
}
