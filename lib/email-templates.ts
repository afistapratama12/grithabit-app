// Email Templates as TypeScript Constants
// This avoids file system issues in serverless environments

import { PUBLIC_APP } from "./constants"

export const EMAIL_VERIFICATION_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email - Grithabit</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f8fafc;
            color: #334155;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            padding: 40px 30px;
            text-align: center;
        }
        .logo {
            font-size: 32px;
            font-weight: bold;
            color: #ffffff;
            margin-bottom: 8px;
        }
        .tagline {
            color: #e2e8f0;
            font-size: 16px;
            margin: 0;
        }
        .content {
            padding: 40px 30px;
            text-align: center;
        }
        .title {
            font-size: 24px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 16px;
        }
        .subtitle {
            font-size: 16px;
            color: #64748b;
            margin-bottom: 32px;
            line-height: 1.5;
        }
        .verification-code {
            background-color: #f1f5f9;
            border: 2px dashed #cbd5e1;
            border-radius: 8px;
            padding: 24px;
            margin: 32px 0;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #1e293b;
            font-family: 'Courier New', monospace;
        }
        .verify-button {
            display: inline-block;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            color: #ffffff;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin: 24px 0;
            transition: transform 0.2s;
        }
        .verify-button:hover {
            transform: translateY(-2px);
        }
        .info-section {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 16px;
            margin: 32px 0;
            text-align: left;
        }
        .info-title {
            font-weight: 600;
            color: #92400e;
            margin-bottom: 8px;
        }
        .info-text {
            color: #92400e;
            font-size: 14px;
            line-height: 1.4;
        }
        .footer {
            background-color: #f8fafc;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
        .footer-text {
            font-size: 14px;
            color: #64748b;
            margin: 0 0 16px 0;
        }
        .social-links {
            margin: 16px 0;
        }
        .social-link {
            display: inline-block;
            margin: 0 8px;
            color: #64748b;
            text-decoration: none;
        }
        .divider {
            height: 1px;
            background-color: #e2e8f0;
            margin: 32px 0;
        }
        @media (max-width: 600px) {
            .container {
                margin: 0 16px;
            }
            .header, .content, .footer {
                padding: 24px 20px;
            }
            .verification-code {
                font-size: 24px;
                letter-spacing: 4px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="logo">Grithabit</div>
            <p class="tagline">Build consistent habits, achieve your goals</p>
        </div>

        <!-- Main Content -->
        <div class="content">
            <h1 class="title">Verify Your Email Address</h1>
            <p class="subtitle">
                Welcome to Grithabit! We're excited to have you join our community of goal achievers. 
                To complete your registration, please verify your email address using the code below.
            </p>

            <!-- Verification Code Box -->
            <div class="verification-code">
                {{ .Token }}
            </div>

            <!-- Verify Button -->
            <a href="{{ .ConfirmationURL }}" class="verify-button">
                Verify Email Address
            </a>

            <!-- Important Info -->
            <div class="info-section">
                <div class="info-title">🔒 Security Notice</div>
                <div class="info-text">
                    • This verification code will expire in <strong>10 minutes</strong><br>
                    • Only use this code on the Grithabit website<br>
                    • Never share this code with anyone
                </div>
            </div>

            <div class="divider"></div>

            <p style="font-size: 14px; color: #64748b; line-height: 1.5;">
                If you're having trouble with the button above, copy and paste the URL below into your web browser:
                <br><br>
                <span style="word-break: break-all; color: #6366f1;">{{ .ConfirmationURL }}</span>
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p class="footer-text">
                If you didn't create an account with Grithabit, you can safely ignore this email.
            </p>
            
            <div class="social-links">
                <a href="#" class="social-link">Website</a>
                <a href="#" class="social-link">Support</a>
                <a href="#" class="social-link">Privacy Policy</a>
            </div>
            
            <p style="font-size: 12px; color: #94a3b8; margin: 16px 0 0 0;">
                © 2025 Grithabit. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>`

export const WELCOME_EMAIL_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Grithabit!</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f8fafc;
            color: #334155;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #059669 0%, #10b981 100%);
            padding: 40px 30px;
            text-align: center;
        }
        .logo {
            font-size: 32px;
            font-weight: bold;
            color: #ffffff;
            margin-bottom: 8px;
        }
        .welcome-message {
            color: #d1fae5;
            font-size: 18px;
            margin: 0;
        }
        .content {
            padding: 40px 30px;
        }
        .title {
            font-size: 24px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 16px;
            text-align: center;
        }
        .greeting {
            font-size: 16px;
            color: #64748b;
            margin-bottom: 32px;
            line-height: 1.6;
        }
        .feature-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 24px;
            margin: 32px 0;
        }
        .feature-item {
            text-align: center;
            padding: 20px;
            background-color: #f8fafc;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
        }
        .feature-icon {
            font-size: 32px;
            margin-bottom: 12px;
        }
        .feature-title {
            font-size: 14px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 8px;
        }
        .feature-desc {
            font-size: 12px;
            color: #64748b;
            line-height: 1.4;
        }
        .cta-section {
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            border-radius: 12px;
            padding: 32px;
            text-align: center;
            margin: 32px 0;
            border: 1px solid #bfdbfe;
        }
        .cta-title {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 12px;
        }
        .cta-text {
            font-size: 16px;
            color: #1e40af;
            margin-bottom: 24px;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            color: #ffffff;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            transition: transform 0.2s;
        }
        .cta-button:hover {
            transform: translateY(-2px);
        }
        .tips-section {
            background-color: #fefce8;
            border-left: 4px solid #eab308;
            padding: 20px;
            margin: 32px 0;
            border-radius: 4px;
        }
        .tips-title {
            font-weight: 600;
            color: #a16207;
            margin-bottom: 12px;
            font-size: 16px;
        }
        .tip-item {
            color: #a16207;
            font-size: 14px;
            margin-bottom: 8px;
            padding-left: 20px;
            position: relative;
        }
        .tip-item:before {
            content: "💡";
            position: absolute;
            left: 0;
        }
        .footer {
            background-color: #f8fafc;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
        .footer-text {
            font-size: 14px;
            color: #64748b;
            margin: 0 0 16px 0;
        }
        @media (max-width: 600px) {
            .container {
                margin: 0 16px;
            }
            .header, .content, .footer {
                padding: 24px 20px;
            }
            .feature-grid {
                grid-template-columns: 1fr;
                gap: 16px;
            }
            .cta-section {
                padding: 24px 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="logo">Grithabit</div>
            <p class="welcome-message">🎉 Welcome to the family!</p>
        </div>

        <!-- Main Content -->
        <div class="content">
            <h1 class="title">Your account is ready!</h1>
            
            <div class="greeting">
                Hi <strong>{{ .UserMetaData.full_name }}</strong>,<br><br>
                
                Congratulations! Your email has been verified and your Grithabit account is now active. 
                You're about to embark on an amazing journey of building consistent habits and achieving your goals.
            </div>

            <!-- Features -->
            <div class="feature-grid">
                <div class="feature-item">
                    <div class="feature-icon">💪</div>
                    <div class="feature-title">Workout</div>
                    <div class="feature-desc">Track your fitness activities and build healthy exercise habits</div>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">📚</div>
                    <div class="feature-title">Learning</div>
                    <div class="feature-desc">Document your learning journey and educational progress</div>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">🎨</div>
                    <div class="feature-title">Creating</div>
                    <div class="feature-desc">Record your creative projects and artistic endeavors</div>
                </div>
            </div>

            <!-- Call to Action -->
            <div class="cta-section">
                <div class="cta-title">Ready to start your journey?</div>
                <div class="cta-text">Set your first goal and begin tracking your daily progress today!</div>
                <a href="${PUBLIC_APP || 'https://grithabit.com'}/dashboard" class="cta-button">Start Your Journey</a>
            </div>

            <!-- Tips Section -->
            <div class="tips-section">
                <div class="tips-title">🚀 Pro Tips for Success</div>
                <div class="tip-item">Start small - even 5 minutes daily can build powerful habits</div>
                <div class="tip-item">Set realistic goals that challenge but don't overwhelm you</div>
                <div class="tip-item">Track consistently - daily logging creates accountability</div>
                <div class="tip-item">Celebrate small wins - progress is progress, no matter how small</div>
            </div>

            <p style="font-size: 14px; color: #64748b; line-height: 1.6; margin-top: 32px;">
                Need help getting started? Our support team is here to help you succeed. 
                Simply reply to this email or visit our help center.
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p class="footer-text">
                Thanks for joining Grithabit! We're excited to be part of your success story.
            </p>
            
            <p style="font-size: 12px; color: #94a3b8; margin: 16px 0 0 0;">
                © 2025 Grithabit. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>`
