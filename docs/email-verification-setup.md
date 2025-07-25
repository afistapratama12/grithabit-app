# Email Verification Setup for Supabase

## Konfigurasi Email di Supabase Dashboard

### 1. Setup Email Templates

1. **Masuk ke Supabase Dashboard**
   - Buka project Anda di [supabase.com](https://supabase.com)
   - Pilih project yang digunakan

2. **Navigasi ke Authentication > Email Templates**
   - Di sidebar kiri, klik "Authentication"
   - Klik tab "Email Templates"

3. **Konfigurasi "Confirm signup" Template**
   - Pilih "Confirm signup" dari dropdown
   - Copy dan paste template dari `templates/email-verification-otp.html`
   - Atau gunakan template sederhana ini:

```html
<h2>Verify Your Email - Grithabit</h2>

<p>Welcome to Grithabit! Please use this verification code to confirm your email address:</p>

<div style="background-color: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 8px; padding: 24px; margin: 32px 0; text-align: center;">
    <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1e293b; font-family: 'Courier New', monospace;">
        {{ .Token }}
    </div>
</div>

<p>This code will expire in 24 hours for security reasons.</p>

<p>If you didn't sign up for Grithabit, you can safely ignore this email.</p>

<hr>
<p style="font-size: 12px; color: #64748b;">
© 2025 Grithabit. All rights reserved.
</p>
```

### 2. Template Variables yang Tersedia

Supabase menyediakan beberapa variabel yang bisa digunakan dalam template:

- `{{ .Token }}` - 6-digit OTP code untuk verifikasi
- `{{ .ConfirmationURL }}` - URL untuk konfirmasi email (jika menggunakan URL)
- `{{ .SiteURL }}` - URL utama aplikasi
- `{{ .UserMetaData.full_name }}` - Nama lengkap user (jika disimpan di metadata)

### 3. Konfigurasi URL Configuration

1. **Pergi ke Authentication > URL Configuration**
2. **Set Site URL**: 
   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com`
3. **Add Redirect URLs**: 
   - `http://localhost:3000/auth/callback`
   - `https://yourdomain.com/auth/callback` (untuk production)

### 4. Konfigurasi Email Provider (Opsional tapi Direkomendasikan)

Untuk production, sangat disarankan menggunakan SMTP provider sendiri:

#### Gmail SMTP Configuration:
1. **Pergi ke Authentication > Settings**
2. **Enable custom SMTP**
3. **SMTP Settings**:
   ```
   Host: smtp.gmail.com
   Port: 587
   Username: your-email@gmail.com
   Password: your-app-password (bukan password biasa)
   ```

#### SendGrid Configuration:
```
Host: smtp.sendgrid.net
Port: 587
Username: apikey
Password: your-sendgrid-api-key
```

## Environment Variables

Pastikan `.env.local` file Anda berisi:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Running dengan Bun

Project ini sudah dikonfigurasi untuk menggunakan Bun. Gunakan commands berikut:

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Build for production
bun run build

# Start production server
bun run start

# Database setup
bun run db:setup

# Push database changes
bun run db:push

# Type checking
bun run type-check
```

## Template Email yang Tersedia

1. **`email-verification-otp.html`** - Template untuk OTP verification
2. **`email-verification.html`** - Template dengan tombol konfirmasi
3. **`welcome-email.html`** - Template welcome setelah verifikasi berhasil

## Testing Email Verification

### Development Mode
- Supabase akan menggunakan built-in email service
- Email akan dikirim ke inbox yang sebenarnya
- Pastikan email address yang digunakan valid

### Production Mode
- Setup SMTP provider untuk reliability
- Test email delivery
- Monitor email logs di dashboard

## Troubleshooting

### Email tidak diterima
1. **Check spam folder**
2. **Verify email address format**
3. **Check SMTP configuration** (jika menggunakan custom SMTP)
4. **Check Supabase logs** di Dashboard > Logs
5. **Verify email template** tidak ada error syntax

### Error "Email not confirmed"
1. **Pastikan user mengklik link konfirmasi atau memasukkan OTP yang benar**
2. **Check URL configuration**
3. **Verify callback handler** di `/auth/callback`

### OTP tidak bekerja
1. **Check email template** memiliki `{{ .Token }}` untuk OTP
2. **Verify OTP settings** di Authentication > Settings
3. **Check token expiration** (default 24 hours)
4. **Pastikan menggunakan verifyOTP function** yang benar

## Flow Email Verification

1. **User mendaftar** dengan email dan password
2. **Supabase mengirim email** konfirmasi dengan 6-digit OTP
3. **User memasukkan OTP** di form verifikasi
4. **App memverifikasi OTP** dengan `verifyOTP()`
5. **User langsung diarahkan** ke dashboard setelah sukses
6. **Session tersimpan** untuk login otomatis

## Best Practices

1. **Always validate email format** di frontend dan backend
2. **Implement rate limiting** untuk resend OTP
3. **Provide clear error messages** untuk user experience
4. **Log verification attempts** untuk monitoring
5. **Set appropriate token expiration** time
6. **Use professional email templates** untuk brand consistency
7. **Test email delivery** di berbagai email providers
8. **Monitor bounce rates** dan email reputation

## Kustomisasi Template

Untuk kustomisasi template email:

1. **Edit file template** di folder `templates/`
2. **Test template** dengan email yang berbeda
3. **Copy final template** ke Supabase Dashboard
4. **Test end-to-end flow** dari registration hingga verification
5. **Monitor email delivery** dan user feedback
