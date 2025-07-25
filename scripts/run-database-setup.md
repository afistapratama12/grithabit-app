# Cara Menjalankan Setup Database

## Metode 1: Supabase Dashboard (Termudah)

1. **Login ke Supabase Dashboard**
   - Buka [supabase.com](https://supabase.com)
   - Login dengan akun Anda
   - Pilih project yang ingin digunakan

2. **Akses SQL Editor**
   - Di sidebar kiri, klik "SQL Editor"
   - Klik "New query"

3. **Copy dan Jalankan Script**
   - Copy seluruh isi dari file `scripts/setup-database.sql`
   - Paste ke SQL Editor
   - Klik "Run" untuk menjalankan script

## Metode 2: Supabase CLI

1. **Login ke Supabase CLI**
   ```bash
   supabase login
   ```
   
2. **Link project dengan folder lokal**
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```
   
   Project REF bisa ditemukan di:
   - Dashboard Supabase > Settings > General > Reference ID

3. **Jalankan migration**
   ```bash
   supabase db push
   ```

## Metode 3: psql (Advanced)

Jika Anda memiliki connection string database:

```bash
psql "postgresql://postgres:[YOUR-PASSWORD]@[HOST]:5432/postgres" -f scripts/setup-database.sql
```

## Verification

Setelah menjalankan script, verifikasi bahwa tabel telah dibuat:

```sql
-- Check if tables are created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('activities', 'goals');

-- Check RLS policies
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('activities', 'goals');
```

## Troubleshooting

### Error: "permission denied for schema public"
- Pastikan Anda menggunakan user dengan privileges yang cukup
- Pastikan RLS sudah diaktifkan

### Error: "table already exists"
- Script menggunakan `CREATE TABLE IF NOT EXISTS`, jadi ini normal
- Jika ada error, coba drop table terlebih dahulu (hati-hati data akan hilang)

### Connection Issues
- Pastikan project Supabase sudah aktif
- Check connection string di Settings > Database
