#!/bin/bash

# Setup script untuk Grithabit App
# Menggunakan Bun sebagai package manager

echo "🚀 Setting up Grithabit App with Bun"
echo "===================================="

# Check if bun is installed
if ! command -v bun &> /dev/null; then
    echo "❌ Bun is not installed. Installing Bun..."
    
    # Install Bun
    curl -fsSL https://bun.sh/install | bash
    
    # Add bun to PATH for current session
    export PATH="$HOME/.bun/bin:$PATH"
    
    # Check if installation was successful
    if ! command -v bun &> /dev/null; then
        echo "❌ Failed to install Bun. Please install manually from https://bun.sh"
        exit 1
    fi
    
    echo "✅ Bun installed successfully!"
else
    echo "✅ Bun is already installed"
fi

# Display Bun version
echo "📦 Bun version: $(bun --version)"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Please run this script from the project root directory."
    exit 1
fi

echo "📦 Installing dependencies with Bun..."
bun install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully!"

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found. Creating from .env.example..."
    
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        echo "📝 .env.local created from .env.example"
        echo "🔧 Please edit .env.local with your Supabase credentials:"
        echo "   - NEXT_PUBLIC_SUPABASE_URL"
        echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    else
        echo "⚠️  .env.example not found. Please create .env.local manually with Supabase credentials."
    fi
else
    echo "✅ .env.local exists"
fi

# Check for Supabase CLI
echo ""
echo "🗄️  Checking Supabase CLI..."
if ! command -v supabase &> /dev/null; then
    echo "⚠️  Supabase CLI is not installed."
    echo "📖 To install Supabase CLI:"
    echo "   macOS: brew install supabase/tap/supabase"
    echo "   Other: https://supabase.com/docs/guides/cli"
else
    echo "✅ Supabase CLI is installed ($(supabase --version))"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env.local with your Supabase credentials"
echo "2. Setup your database: bun run db:setup"
echo "3. Configure email templates in Supabase Dashboard"
echo "4. Start development server: bun run dev"
echo ""
echo "📚 Documentation:"
echo "- Email setup: docs/email-verification-setup.md"
echo "- Database setup: scripts/run-database-setup.md"
echo ""
echo "🚀 Happy coding with Grithabit!"
