#!/bin/bash

# Script untuk testing email templates
# Membuka templates di browser untuk preview

echo "📧 Email Template Previewer"
echo "=========================="

TEMPLATES_DIR="templates"

if [ ! -d "$TEMPLATES_DIR" ]; then
    echo "❌ Templates directory not found!"
    exit 1
fi

echo "Available email templates:"
echo "1. Email Verification (OTP)"
echo "2. Email Verification (with button)"
echo "3. Welcome Email"
echo "4. Open all templates"
echo ""

read -p "Select template to preview (1-4): " choice

case $choice in
    1)
        echo "🔗 Opening OTP verification template..."
        open "$TEMPLATES_DIR/email-verification-otp.html"
        ;;
    2)
        echo "🔗 Opening button verification template..."
        open "$TEMPLATES_DIR/email-verification.html"
        ;;
    3)
        echo "🔗 Opening welcome email template..."
        open "$TEMPLATES_DIR/welcome-email.html"
        ;;
    4)
        echo "🔗 Opening all templates..."
        open "$TEMPLATES_DIR/email-verification-otp.html"
        open "$TEMPLATES_DIR/email-verification.html"
        open "$TEMPLATES_DIR/welcome-email.html"
        ;;
    *)
        echo "❌ Invalid selection"
        exit 1
        ;;
esac

echo ""
echo "📝 Template Variables for Testing:"
echo "{{ .Token }}              -> 123456"
echo "{{ .ConfirmationURL }}    -> https://grithabit.com/auth/callback"
echo "{{ .SiteURL }}            -> https://grithabit.com"
echo "{{ .UserMetaData.full_name }} -> John Doe"
echo ""
echo "💡 To test with real data, copy template content to Supabase Dashboard"
