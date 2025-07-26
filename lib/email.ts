import nodemailer from 'nodemailer'
import { EMAIL_VERIFICATION_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from './email-templates'
import { APP_PASSWORD, PUBLIC_APP, SENDER_EMAIL, SMTP_HOST, SMTP_PORT, SMTP_SECURE, USER_EMAIL } from './constants'

// Email configuration
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: {
    user: USER_EMAIL,
    pass: APP_PASSWORD
  },
})

// Email template types
interface OTPEmailData {
  email: string
  fullName: string
  otp: string
}

interface WelcomeEmailData {
  email: string
  fullName: string
}

// Replace template variables
function processTemplate(template: string, data: Record<string, any>): string {
  let processedTemplate = template
  
  // Replace all template variables
  Object.keys(data).forEach(key => {
    const regex = new RegExp(`{{ ?\\.${key} ?}}`, 'g')
    processedTemplate = processedTemplate.replace(regex, data[key] || '')
  })
  
  return processedTemplate
}

// Send OTP verification email
export async function sendOTPEmail({ email, fullName, otp }: OTPEmailData): Promise<void> {
  try {
    // Template data for OTP email
    const templateData = {
      Token: otp,
      ConfirmationURL: `${PUBLIC_APP}/auth/verify?email=${encodeURIComponent(email)}&otp=${otp}`,
      UserMetaData: {
        full_name: fullName
      }
    }
    
    const htmlContent = processTemplate(EMAIL_VERIFICATION_TEMPLATE, templateData)
    
    const mailOptions = {
      from: {
        name: 'Grithabit',
        address: SENDER_EMAIL
      },
      to: email,
      subject: 'Verify Your Email - Grithabit',
      html: htmlContent,
    }
    
    await transporter.sendMail(mailOptions)
    console.log(`OTP email sent successfully to ${email}`)
  } catch (error) {
    console.error('Error sending OTP email:', error)
    throw new Error('Failed to send verification email')
  }
}

// Send welcome email
export async function sendWelcomeEmail({ email, fullName }: WelcomeEmailData): Promise<void> {
  try {
    // Template data for welcome email
    const templateData = {
      UserMetaData: {
        full_name: fullName
      }
    }
    
    const htmlContent = processTemplate(WELCOME_EMAIL_TEMPLATE, templateData)
    
    const mailOptions = {
      from: {
        name: 'Grithabit',
        address: SENDER_EMAIL,
      },
      to: email,
      subject: '🎉 Welcome to Grithabit - Your Journey Starts Now!',
      html: htmlContent,
    }
    
    await transporter.sendMail(mailOptions)
    console.log(`Welcome email sent successfully to ${email}`)
  } catch (error) {
    console.error('Error sending welcome email:', error)
    throw new Error('Failed to send welcome email')
  }
}

// Verify email configuration
export async function verifyEmailConfig(): Promise<boolean> {
  try {
    await transporter.verify()
    console.log('Email server is ready to send emails')
    return true
  } catch (error) {
    console.error('Email configuration error:', error)
    return false
  }
}
