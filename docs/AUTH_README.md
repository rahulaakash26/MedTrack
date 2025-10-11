# Authentication Features

The MedTrack application now includes complete authentication functionality using Supabase Auth.

## Features Included

### 🔐 User Authentication
- **Sign Up**: New users can create an account with email and password
- **Login**: Existing users can sign in securely
- **Logout**: Users can sign out from any page
- **Password Reset**: Users can reset their password via email
- **Update Password**: Users can set a new password after requesting a reset

### 🎨 Consistent Design
All authentication pages maintain the same design language as your main app:
- Blue header (#4a6fa5)
- Coral/red primary buttons (#ff6b6b)
- Clean, modern UI with rounded corners
- Mobile-first responsive design
- Smooth animations and transitions

### 📄 Pages Created

1. **auth/login.html** - Sign in page
2. **auth/signup.html** - Account creation page
3. **auth/reset-password.html** - Request password reset
4. **auth/update-password.html** - Set new password (from email link)

### 🔧 Files Added/Modified

**New Files:**
- `assets/js/auth.js` - Authentication handler class
- `assets/css/auth-style.css` - Styles for authentication pages
- `auth/login.html` - Login page
- `auth/signup.html` - Signup page
- `auth/reset-password.html` - Password reset request page
- `auth/update-password.html` - Password update page
- `SETUP.md` - Comprehensive setup guide for Supabase

**Modified Files:**
- `index.html` - Added user menu and authentication check
- `assets/js/app.js` - Integrated Supabase authentication
- `assets/css/style.css` - Added responsive header styles

## Quick Start

### For First-Time Setup:

1. **Configure Supabase** (if not done already):
   - Make sure you have `config/config.js` with your Supabase credentials
   - Follow the detailed steps in `SETUP.md`

2. **Enable Email Authentication**:
   - Log into your Supabase dashboard
   - Ensure Email provider is enabled in Authentication settings

3. **Set Up RLS Policies**:
   - Enable Row Level Security on your `medicines` table
   - Add policies so users can only access their own data
   - See `SETUP.md` for SQL commands

4. **Configure URLs**:
   - Set Site URL and Redirect URLs in Supabase
   - For local: `http://localhost:5500` or your dev server
   - For production: your deployed URL

### For Users:

1. **Create Account**: Go to `auth/signup.html` or click "Create Account" on login page
2. **Verify Email**: Check email and click verification link (if enabled)
3. **Sign In**: Go to `auth/login.html` or just open the app (auto-redirects)
4. **Use App**: Add and manage your medicines
5. **Sign Out**: Click your email in header → "Sign Out"

## User Flow

```
┌───────────────────┐
│   Login           │ ──── New User? ───▶ │   Signup    │
│(auth/login.html)  │                     │(auth/signup.html)│
└─────────┬─────────┘                     └──────┬──────┘
       │                                   │
       │                              Verify Email
       │                                   │
       └─────────────┬─────────────────────┘
                     ▼
            ┌────────────────┐
            │  Main App      │
            │  (index.html)  │
            │                │
            │  - Add meds    │
            │  - View meds   │
            │  - Get alerts  │
            │  - User menu   │
            └────────┬───────┘
                     │
            Click user menu
                     │
                     ▼
              ┌────────────┐
              │  Sign Out  │
              └────────────┘
```

## Security Features

✅ **Secure Authentication**: Powered by Supabase Auth
✅ **Row Level Security**: Users can only access their own data
✅ **Password Hashing**: Passwords are securely hashed
✅ **Email Verification**: Optional email confirmation on signup
✅ **Session Management**: Automatic session handling
✅ **Protected Routes**: Unauthenticated users redirected to login

## API Reference

### AuthHandler Class (`assets/js/auth.js`)

```javascript
const authHandler = new AuthHandler();

// Sign up a new user
await authHandler.signup(email, password);

// Sign in
await authHandler.login(email, password);

// Sign out
await authHandler.logout();

// Request password reset
await authHandler.resetPassword(email);

// Update password (after reset link)
await authHandler.updatePassword(newPassword);

// Get current user
await authHandler.getCurrentUser();

// Check authentication status
await authHandler.requireAuth(); // Redirects if not authenticated
```

## Customization

### Styling
All authentication styles are in `assets/css/auth-style.css`. You can customize:
- Colors (currently matching your app's blue/coral theme)
- Button styles
- Form layouts
- Animations

### Email Templates
Customize email templates in Supabase Dashboard:
- **Authentication** → **Email Templates**
- Modify welcome emails, password reset emails, etc.

### Validation Rules
Update password requirements in the signup and update-password pages:
- Current: Minimum 6 characters
- You can add complexity requirements (uppercase, numbers, symbols)

## Troubleshooting

**Problem**: Can't log in after signup
- **Solution**: Check if email verification is required. If enabled, verify your email first.

**Problem**: "Invalid credentials" error
- **Solution**: Ensure you're using the correct email/password. Check if the user exists in Supabase Dashboard.

**Problem**: Password reset email not received
- **Solution**: Check spam folder. Verify email settings in Supabase Dashboard.

**Problem**: Redirected to login when already logged in
- **Solution**: Clear browser cache/cookies and log in again.

**Problem**: Users can see each other's medicines
- **Solution**: Enable RLS and create proper policies (see `SETUP.md`).

## Testing

### Test Authentication Flow:
1. Sign up with a test email
2. Verify email (if required)
3. Log in
4. Add a medicine
5. Log out
6. Log in again - verify the medicine is still there
7. Test password reset flow

### Test Security:
1. Create two different user accounts
2. Add medicines to each account
3. Verify each user can only see their own medicines
4. Try accessing `index.html` without being logged in (should redirect to login)

## Next Steps

Consider adding these features:
- [ ] OAuth providers (Google, GitHub, etc.)
- [ ] Multi-factor authentication (MFA)
- [ ] Remember me functionality
- [ ] User profile settings
- [ ] Account deletion
- [ ] Email change functionality
- [ ] Password strength indicator
- [ ] Rate limiting on login attempts

## Support

For detailed setup instructions, see `SETUP.md`.
For Supabase documentation, visit [https://supabase.com/docs](https://supabase.com/docs).

---

**Enjoy your secure MedTrack app! 💊🔒**

