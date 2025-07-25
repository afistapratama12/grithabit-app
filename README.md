# 🎯 Grithabit - Habit Tracking App

A modern habit tracking application built with Next.js, TypeScript, Supabase, and Bun. Track your progress in workout, learning, and creative activities with beautiful analytics and goal setting.

## ✨ Features

- 🔐 **Secure Authentication** with email verification
- 📊 **Activity Tracking** for Workout, Learning, and Creating
- 🎯 **Goal Setting** with monthly and yearly targets
- 📈 **Progress Analytics** with beautiful charts
- 📱 **Responsive Design** for mobile and desktop
- 🎨 **Modern UI** with Tailwind CSS and Radix UI
- 🚀 **Fast Performance** powered by Bun

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Package Manager**: Bun
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with email verification
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh) (latest version)
- [Supabase Account](https://supabase.com)

### Installation

1. **Clone and setup the project**:
   ```bash
   git clone <repository-url>
   cd grithabit-app
   
   # Run the setup script
   ./scripts/setup-project.sh
   ```

2. **Configure environment variables**:
   ```bash
   # Edit .env.local with your Supabase credentials
   cp .env.example .env.local
   ```

3. **Setup database**:
   ```bash
   # Setup Supabase database tables
   bun run db:setup
   ```

4. **Start development server**:
   ```bash
   bun run dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to see the app!

## 📝 Manual Setup

If you prefer manual setup:

### 1. Install Dependencies
```bash
bun install
```

### 2. Environment Variables
Create `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup
```bash
# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Run database migrations
bun run db:push
```

### 4. Email Templates Setup
1. Go to Supabase Dashboard > Authentication > Email Templates
2. Copy content from `templates/email-verification-otp.html`
3. Configure URL redirects in Authentication > URL Configuration

## 📜 Available Scripts

```bash
# Development
bun run dev          # Start development server
bun run build        # Build for production
bun run start        # Start production server
bun run lint         # Run ESLint
bun run type-check   # Run TypeScript compiler

# Database
bun run db:setup     # Reset and setup database
bun run db:push      # Push database changes

# Utilities
./scripts/setup-project.sh     # Full project setup
./scripts/setup-supabase.sh    # Supabase-specific setup
```

## 🗄️ Database Schema

### Tables

- **activities**: User activity logs (workout, learning, creating)
- **goals**: User goals with monthly/yearly targets

### Security

- Row Level Security (RLS) enabled
- Users can only access their own data
- Email verification required for account activation

## 🎨 Email Templates

Beautiful, responsive email templates included:

- **Verification Email**: OTP-based email verification
- **Welcome Email**: Post-verification welcome message
- **Professional Design**: Modern, mobile-friendly templates

Templates available in `/templates/` directory.

## 🔧 Configuration

### Supabase Setup

1. **Create Project**: Create new project in Supabase Dashboard
2. **Get Credentials**: Copy URL and anon key from Settings > API
3. **Configure Auth**: 
   - Enable email confirmation
   - Set redirect URLs
   - Configure email templates
4. **Run Migrations**: Use provided SQL scripts

### Email Configuration

For production, configure SMTP in Supabase:
- Gmail SMTP
- SendGrid
- Other SMTP providers

See `docs/email-verification-setup.md` for detailed instructions.

## 📱 Features Overview

### Authentication
- Email/password registration
- Email verification with OTP
- Secure login/logout
- Protected routes

### Activity Tracking
- Log activities in 3 categories
- Rich text descriptions
- Timestamp tracking
- Progress visualization

### Goal Setting
- Monthly and yearly goals
- Target count setting
- Progress tracking
- Achievement analytics

### Dashboard
- Activity feed
- Contribution chart (GitHub-style)
- Goal progress indicators
- Analytics overview

## 🎯 Project Structure

```
grithabit-app/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # UI components (shadcn/ui)
│   └── *.tsx             # Feature components
├── lib/                  # Utility libraries
│   ├── auth.ts           # Auth functions
│   ├── database.ts       # Database functions
│   ├── supabase.ts       # Supabase client
│   ├── types.ts          # TypeScript types
│   └── validations.ts    # Zod schemas
├── templates/            # Email templates
├── scripts/              # Setup scripts
├── docs/                 # Documentation
└── supabase/            # Supabase config & migrations
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📖 **Documentation**: Check the `/docs` folder
- 🐛 **Issues**: Report bugs via GitHub Issues
- 💬 **Discussions**: Join GitHub Discussions for questions

## 🔗 Links

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Bun Documentation](https://bun.sh/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)

---

Built with ❤️ using modern web technologies. Happy habit tracking! 🎉
