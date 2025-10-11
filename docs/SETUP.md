# MedTrack Authentication Setup Guide

This guide will help you configure Supabase authentication for the MedTrack application.

## Prerequisites

- A Supabase account and project
- Your Supabase URL and Anon Key (already configured in `config.js`)

## Step 1: Enable Email Authentication

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to **Authentication** → **Providers**
4. Make sure **Email** provider is enabled (it's usually enabled by default)
5. Configure email settings:
   - **Enable Email Confirmations**: Toggle ON (recommended for security)
   - **Secure Email Change**: Toggle ON (recommended)
   - **Secure Password Change**: Toggle ON (recommended)

## Step 2: Configure Email Templates (Optional but Recommended)

1. In Supabase Dashboard, go to **Authentication** → **Email Templates**
2. Customize the following templates if desired:
   - **Confirm Signup**: Email sent when users sign up
   - **Magic Link**: For passwordless login (if you want to add this later)
   - **Reset Password**: Email sent when users request password reset
   - **Change Email Address**: Email sent when users change their email

### Important: Update Password Reset Template

Make sure the password reset email template redirects to your update password page:

```html
<a href="{{ .SiteURL }}/auth/update-password.html">Reset Password</a>
```

Or use the token-based approach:
```html
<a href="{{ .ConfirmationURL }}">Reset Password</a>
```

## Step 3: Update Row Level Security (RLS) Policies

### Enable RLS on the medicines table

1. Go to **Database** → **Tables** in your Supabase dashboard
2. Find the `medicines` table
3. Click on it and go to **RLS** tab
4. Enable RLS if not already enabled

### Create RLS Policies

You need to create policies so users can only access their own medicines.

#### Policy 1: Select (Read) - Users can only see their own medicines

```sql
CREATE POLICY "Users can view their own medicines"
ON medicines
FOR SELECT
USING (auth.uid() = user_id);
```

#### Policy 2: Insert - Users can only create medicines for themselves

```sql
CREATE POLICY "Users can insert their own medicines"
ON medicines
FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

#### Policy 3: Update - Users can only update their own medicines

```sql
CREATE POLICY "Users can update their own medicines"
ON medicines
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

#### Policy 4: Delete - Users can only delete their own medicines

```sql
CREATE POLICY "Users can delete their own medicines"
ON medicines
FOR DELETE
USING (auth.uid() = user_id);
```

### To add these policies:

1. Go to **SQL Editor** in Supabase dashboard
2. Run each SQL command above
3. Or go to **Authentication** → **Policies** and use the visual policy builder

## Step 4: Update Database Schema (IMPORTANT)

Your `user_id` column must be type `uuid` to work with Supabase Auth.

### If you have existing data with old user_id format:

**Option A: Clear existing data (for testing/development)**
```sql
-- Delete all existing medicines (if this is test data)
TRUNCATE TABLE medicines;

-- Convert user_id to uuid type
ALTER TABLE medicines 
ALTER COLUMN user_id TYPE uuid USING user_id::uuid;
```

**Option B: Keep existing data (migrate later)**
```sql
-- Just convert the column type (will fail if non-UUID data exists)
-- You'll need to manually migrate existing records to match new user IDs
ALTER TABLE medicines 
ALTER COLUMN user_id TYPE uuid USING user_id::uuid;
```

### If this is a fresh setup (no data yet):

```sql
-- Simply convert the column type
ALTER TABLE medicines 
ALTER COLUMN user_id TYPE uuid USING user_id::uuid;

-- Optionally add foreign key constraint (recommended for data integrity)
ALTER TABLE medicines
ADD CONSTRAINT medicines_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;
```

## Step 5: Configure Site URL

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL** to your application URL:
   - For local development: `http://localhost:5500` or your local server
   - For production: Your deployed URL (e.g., `https://yourdomain.com`)
3. Add **Redirect URLs** (whitelist):
   - `http://localhost:5500/**` (for local development)
   - `http://localhost:5500/auth/**` (for auth pages)
   - `https://yourdomain.com/**` (for production)
   - `https://yourdomain.com/auth/**` (for production auth)
   - Add your specific pages:
     - `http://localhost:5500/index.html`
     - `http://localhost:5500/auth/update-password.html`
     - `http://localhost:5500/auth/login.html`

## Step 6: Test the Authentication Flow

1. **Sign Up**: Go to `auth/signup.html` and create a new account
   - Check your email for confirmation (if email confirmation is enabled)
   - Click the confirmation link
   
2. **Login**: Go to `auth/login.html` and sign in with your credentials

3. **Reset Password**: 
   - Click "Forgot password?" on the login page
   - Enter your email
   - Check your email for the reset link
   - Click the link and set a new password

4. **Access the App**: After logging in, you should be redirected to `index.html`

5. **Logout**: Click on your email in the header and select "Sign Out"

## Step 7: Handle Email Verification

If you enabled email confirmations, users must verify their email before they can log in. You have two options:

### Option A: Require email verification (more secure)
Users must click the link in their confirmation email before they can log in.

### Option B: Allow unverified emails (less secure but easier for testing)
1. Go to **Authentication** → **Providers**
2. Disable "Enable Email Confirmations"

For production, Option A is highly recommended!

## Troubleshooting

### "Invalid login credentials" error
- Make sure the user has confirmed their email (if email confirmation is enabled)
- Check that the email and password are correct
- Verify that the user exists in **Authentication** → **Users**

### Users can see other users' data
- Make sure RLS is enabled on the `medicines` table
- Verify that all RLS policies are created correctly
- Check that `user_id` is being set correctly when creating medicines

### Email not sending
- Check your email provider settings in **Authentication** → **Providers** → **Email**
- For production, configure a custom SMTP server
- Check spam folder

### Redirect issues after authentication
- Verify your Site URL and Redirect URLs in **Authentication** → **URL Configuration**
- Make sure the redirect URLs match your actual application URLs

## Security Best Practices

1. ✅ **Enable RLS** on all tables containing user data
2. ✅ **Enable email confirmation** for new signups
3. ✅ **Use strong password requirements** (minimum 6 characters, but consider 8+)
4. ✅ **Configure custom SMTP** for production (don't rely on Supabase's default email service)
5. ✅ **Set up proper CORS** and Site URL configuration
6. ✅ **Never commit** your Supabase keys to public repositories
7. ✅ **Use environment variables** for sensitive configuration in production
8. ✅ **Regularly backup** your database

## Additional Features (Optional)

### Add OAuth Providers
You can also enable OAuth providers like Google, GitHub, etc.:
1. Go to **Authentication** → **Providers**
2. Enable desired providers (Google, GitHub, Facebook, etc.)
3. Configure OAuth credentials
4. Update your login page to include OAuth buttons

### Add Multi-Factor Authentication (MFA)
Supabase supports MFA for enhanced security:
1. Enable MFA in **Authentication** → **Settings**
2. Implement MFA flow in your application

### Password Strength Requirements
Consider adding client-side validation for stronger passwords:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

## Need Help?

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Community](https://github.com/supabase/supabase/discussions)

---

**Important**: After completing these steps, your MedTrack application will be fully secured with user authentication! 🎉

