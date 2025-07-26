export const APP_PASSWORD =
  process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASSWORD;

export const SMTP_HOST =
  process.env.EMAIL_PROVIDER === "gmail"
    ? "smtp.gmail.com"
    : process.env.SMTP_HOST || "smtp.gmail.com";

export const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587");
export const SMTP_SECURE = process.env.SMTP_SECURE === "true"; // true for
export const USER_EMAIL = process.env.GMAIL_USER || process.env.SMTP_USER;

export const PUBLIC_APP = process.env.NEXT_PUBLIC_APP_URL;

export const SENDER_EMAIL = USER_EMAIL || "noreply@grithabit.com";

export const NODE_ENV = process.env.NODE_ENV || "development";

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY