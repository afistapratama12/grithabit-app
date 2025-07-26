# Email Setup Guide for Grithabit

This guide explains how to set up email functionality for OTP verification and welcome emails using Nodemailer.

## Features

- ✅ **OTP Verification Email**: Sent during registration with 6-digit verification code
- ✅ **Welcome Email**: Sent after successful account creation
- ✅ **HTML Templates**: Beautiful responsive email templates
- ✅ **Gmail Support**: Easy setup with Gmail SMTP
- ✅ **Environment Based**: Different configs for dev/prod

## Quick Setup

### 1. Environment Variables

Add these to your `.env.local` file:

```bash
# Email Provider
EMAIL_PROVIDER=gmail

# Gmail SMTP (recommended)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-specific-password

# From email address
FROM_EMAIL=noreply@grithabit.com

# Application URL (for email verification links)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Gmail App Password Setup

1. Go to your [Google Account settings](https://myaccount.google.com/)
2. Navigate to **Security** → **2-Step Verification**
3. Scroll down to **App passwords**
4. Generate a new app password for "Mail"
5. Use this password in `GMAIL_APP_PASSWORD`

⚠️ **Important**: Use App Password, NOT your regular Gmail password!

### 3. Test Email Configuration

```bash
# Test email configuration
node scripts/test-email.js

# Test sending emails to a specific address
node scripts/test-email.js your-test-email@gmail.com
```

## Email Templates

### Template Storage
Email templates are now stored as TypeScript constants in `lib/email-templates.ts` instead of HTML files. This approach:
- ✅ **Serverless Compatible**: No file system dependencies
- ✅ **Build Optimized**: Templates are bundled at compile time
- ✅ **Type Safe**: Templates are part of the TypeScript bundle
- ✅ **Environment Aware**: Can use environment variables in templates

### OTP Verification Email
- **Template**: `EMAIL_VERIFICATION_TEMPLATE` constant
- **Trigger**: When user registers
- **Contains**: 6-digit OTP code and verification link
- **Variables**:
  - `{{ .Token }}` - The OTP code
  - `{{ .ConfirmationURL }}` - Direct verification link

### Welcome Email
- **Template**: `WELCOME_EMAIL_TEMPLATE` constant
- **Trigger**: After successful email verification
- **Contains**: Welcome message and app features
- **Variables**:
  - `{{ .UserMetaData.full_name }}` - User's full name

## API Integration

### Registration Flow

```typescript
// 1. User submits registration form
const result = await sendRegistrationOTP(email, password, fullName)

// 2. System sends OTP email automatically
// 3. User receives email with 6-digit code
// 4. User enters OTP code

// 5. System verifies OTP and creates account
const verificationResult = await verifyOTPAndCreateUser(email, otp)

// 6. System sends welcome email automatically (if successful)
```

### Email Functions

```typescript
import { sendOTPEmail, sendWelcomeEmail } from '@/lib/email'

// Send OTP verification email
await sendOTPEmail({
  email: 'user@example.com',
  fullName: 'John Doe',
  otp: '123456'
})

// Send welcome email
await sendWelcomeEmail({
  email: 'user@example.com',
  fullName: 'John Doe'
})
```

## Email Verification Flow

1. **Registration**: User submits email, password, and name
2. **OTP Generation**: System generates 6-digit code (10min expiry)
3. **Email Sent**: OTP email sent with verification code and link
4. **User Verification**: 
   - Option A: Click verification link in email (auto-fills OTP)
   - Option B: Manually enter OTP on verification page
5. **Account Creation**: System creates Supabase account
6. **Welcome Email**: Automatically sent after successful verification
7. **Auto Login**: User is automatically signed in

## Verification URLs

- **Manual Verification**: `/auth/verify`
- **Email Link**: `/auth/verify?email=user@example.com&otp=123456`

## Error Handling

- **Email Send Failure**: Registration fails, OTP is not stored
- **Invalid OTP**: Max 3 attempts before requiring new OTP
- **Expired OTP**: 10-minute expiry, user must request new code
- **Welcome Email Failure**: User account still created successfully

## Development vs Production

### Development
- OTP code logged to console for testing
- `developmentOTP` returned in API response
- Use Gmail SMTP for testing

### Production
- Remove development OTP logging
- Use production SMTP service (Gmail, SendGrid, etc.)
- Set proper `FROM_EMAIL` domain

## Alternative SMTP Providers

### SendGrid
```bash
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your-sendgrid-api-key
```

### Custom SMTP
```bash
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-username
SMTP_PASSWORD=your-password
```

## Troubleshooting

### Common Issues

1. **"Authentication failed"**
   - Check Gmail App Password (not regular password)
   - Ensure 2FA is enabled on Gmail account

2. **"Connection timeout"**
   - Check SMTP host and port
   - Verify firewall/network settings

3. **"From address rejected"**
   - Use proper FROM_EMAIL domain
   - Some providers require verified sender domains

4. **Emails go to spam**
   - Set up SPF/DKIM records
   - Use proper from address
   - Avoid spam trigger words

### Debug Mode

Enable debug logging by setting:
```bash
DEBUG=nodemailer:*
```

## Security Best Practices

- ✅ Use App Passwords, not regular passwords
- ✅ Store credentials in environment variables
- ✅ Set OTP expiry (10 minutes)
- ✅ Limit OTP attempts (3 max)
- ✅ Use HTTPS for verification links
- ✅ Validate email addresses before sending

## Production Checklist

- [ ] Gmail App Password configured
- [ ] Environment variables set
- [ ] Test emails working
- [ ] Welcome email templates updated with production URLs
- [ ] FROM_EMAIL set to proper domain
- [ ] Remove development OTP logging
- [ ] Set up email monitoring/logging
- [ ] Configure SPF/DKIM records (if using custom domain)

## Support

For issues with email setup:
1. Check environment variables
2. Test with `scripts/test-email.js`
3. Verify Gmail App Password setup
4. Check email provider documentation
