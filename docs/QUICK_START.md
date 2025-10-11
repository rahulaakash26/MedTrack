# MedTrack Authentication - Quick Start Guide

## 🚀 What's New

Your MedTrack app now has full authentication! Users can:
- ✅ Create accounts
- ✅ Sign in securely
- ✅ Reset passwords
- ✅ Access only their own medicines
- ✅ Sign out from any page

## ⚡ Quick Setup (5 Minutes)

### Step 1: Supabase Configuration

1. Open [Supabase Dashboard](https://app.supabase.com/)
2. Select your MedTrack project
3. Go to **SQL Editor** and run this:

```sql
-- IMPORTANT: If you have existing test data, clear it first
-- (Skip this line if you want to keep existing data)
TRUNCATE TABLE medicines;

-- Convert user_id from text to uuid to match Supabase auth
ALTER TABLE medicines 
ALTER COLUMN user_id TYPE uuid USING user_id::uuid;

-- Enable RLS on medicines table
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;

-- Create policies for user data access
CREATE POLICY "Users can view their own medicines"
ON medicines FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own medicines"
ON medicines FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own medicines"
ON medicines FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own medicines"
ON medicines FOR DELETE
USING (auth.uid() = user_id);
```

### Step 2: Configure URLs

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL**: `http://localhost:5500` (or your dev server port)
3. Add **Redirect URLs**:
   - `http://localhost:5500/**`
   - `http://localhost:5500/auth/**`
   - `http://localhost:5500/index.html`
   - `http://localhost:5500/auth/update-password.html`

### Step 3: Email Settings (Optional)

**For Quick Testing** (skip email verification):
1. Go to **Authentication** → **Providers** → **Email**
2. **Disable** "Enable Email Confirmations"
3. Save

**For Production** (enable email verification):
- Keep "Enable Email Confirmations" ON
- Configure custom SMTP for production use
- Update email templates in **Authentication** → **Email Templates**

### Step 4: Test It!

1. Open your app (e.g., `http://localhost:5500/auth/login.html`)
2. Click "Create Account"
3. Sign up with your email
4. Log in
5. Add a medicine
6. Click your email in header → Sign Out
7. Log in again - your medicine should still be there! 🎉

## 📁 New File Structure

```
MedTrack/
├── index.html                  # Main application
├── assets/
│   ├── css/
│   │   ├── style.css          # Main styles
│   │   └── auth-style.css     # Auth styles
│   ├── js/
│   │   ├── app.js             # Main app logic
│   │   └── auth.js            # Auth handler
│   └── images/
│       └── pill-icon.svg      # App icon
├── auth/
│   ├── login.html             # Sign in page
│   ├── signup.html            # Create account page
│   ├── reset-password.html    # Request reset
│   └── update-password.html   # Set new password
├── config/
│   ├── config.js              # Your Supabase config
│   └── config.example.js      # Template
└── docs/
    ├── QUICK_START.md         # This file
    ├── SETUP.md               # Detailed setup
    └── AUTH_README.md         # Feature docs
```

## 🔑 Default Landing Page

Users will now see `auth/login.html` first if they're not authenticated.
The main app (`index.html`) is protected - unauthenticated users are redirected to login.

## 🎨 Design

All auth pages match your existing design:
- **Blue header**: #4a6fa5
- **Coral buttons**: #ff6b6b  
- **Modern UI**: Rounded corners, smooth animations
- **Responsive**: Mobile-first design

## 🔒 Security

- ✅ Passwords are securely hashed by Supabase
- ✅ Row Level Security ensures data isolation
- ✅ Email verification available (optional)
- ✅ Secure password reset flow
- ✅ Session-based authentication

## 🐛 Common Issues

### "Email not confirmed"
- Disable email confirmation in Supabase for testing
- Or check your email and click the confirmation link

### "Invalid credentials"
- Double-check email and password
- Verify user exists in Supabase Dashboard → Authentication → Users

### Can't access medicines after login
- Make sure RLS policies are created (Step 1)
- Check browser console for errors

### Password reset email not received
- Check spam folder
- Verify email provider is configured in Supabase
- For testing, use a real email address you can access

## 📱 User Flow

```
Start App → Login Page
            ↓
    No account? → Signup → Verify Email (if enabled) → Login
            ↓
         Login Success → Main App (index.html)
            ↓
    Use app (add medicines, view, search, etc.)
            ↓
    User Menu → Sign Out → Login Page
```

## 🎯 Next Steps

1. **Test the authentication flow** with a real email
2. **Set up email verification** for production
3. **Configure custom SMTP** for production emails
4. **Add OAuth providers** (Google, GitHub) if desired
5. **Customize email templates** in Supabase

## 📚 Need More Help?

- **Detailed Setup**: See `SETUP.md`
- **Feature Docs**: See `AUTH_README.md`
- **Supabase Docs**: https://supabase.com/docs/guides/auth

---

**You're all set! Your MedTrack app is now secure and ready to use! 🎉**

