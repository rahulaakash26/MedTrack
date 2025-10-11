# 🌍 Multi-Environment Setup (Local + Production)

## Overview

Your MedTrack app now automatically detects whether it's running locally or on GitHub Pages and uses the appropriate URLs. **No code changes needed** between environments!

## ✨ How It Works

### Dynamic URL Detection

The app automatically detects:
- **Local**: `http://localhost:5500` or `http://127.0.0.1:5500`
- **Production**: `https://yourusername.github.io/MedTrack`

And constructs the correct redirect URLs:
```javascript
// Local development
http://localhost:5500/auth/login.html
http://localhost:5500/auth/update-password.html

// GitHub Pages
https://yourusername.github.io/MedTrack/auth/login.html
https://yourusername.github.io/MedTrack/auth/update-password.html
```

### Smart Base Path Detection

For GitHub Pages subdirectories:
- Detects `/MedTrack/` automatically
- Adds it to all redirect URLs
- Works with any repository name

## 🔧 One-Time Supabase Configuration

You only need to configure Supabase **once** with **both** environments:

### Step 1: Go to Supabase Dashboard

1. Open [Supabase Dashboard](https://app.supabase.com/)
2. Select your MedTrack project
3. Go to **Authentication** → **URL Configuration**

### Step 2: Set Site URL

Use your **production** URL as the main site URL:
```
https://yourusername.github.io
```

Or if you prefer local development as default:
```
http://localhost:5500
```

(This is just the default; both will work)

### Step 3: Add Redirect URLs (IMPORTANT!)

Add **ALL** of these redirect URLs:

```
# Local Development
http://localhost:5500/**
http://localhost:5500/auth/**
http://localhost:5500/auth/login.html
http://localhost:5500/auth/update-password.html
http://127.0.0.1:5500/**
http://127.0.0.1:5500/auth/**

# Production (GitHub Pages)
https://yourusername.github.io/**
https://yourusername.github.io/MedTrack/**
https://yourusername.github.io/MedTrack/auth/**
https://yourusername.github.io/MedTrack/auth/login.html
https://yourusername.github.io/MedTrack/auth/update-password.html

# If using custom domain (optional)
https://yourdomain.com/**
https://yourdomain.com/auth/**
```

**Important:** Replace `yourusername` and `MedTrack` with your actual values!

### Step 4: Save

Click **Save** at the bottom of the page.

## 🧪 Testing

### Test Local Development

1. **Start local server:**
   ```bash
   python -m http.server 5500
   # or use VS Code Live Server
   ```

2. **Open app:**
   ```
   http://localhost:5500/
   ```

3. **Test signup:**
   - Go to signup page
   - Create account
   - Check email
   - Click verification link
   - Should redirect to: `http://localhost:5500/auth/login.html` ✓

4. **Test password reset:**
   - Go to login page
   - Click "Forgot password?"
   - Enter email
   - Check email
   - Click reset link
   - Should redirect to: `http://localhost:5500/auth/update-password.html` ✓

5. **Check console:**
   ```javascript
   // Should see:
   Dynamic redirect URL: http://localhost:5500/auth/login.html
   ```

### Test Production (GitHub Pages)

1. **Deploy to GitHub Pages** (push to main)

2. **Open deployed app:**
   ```
   https://yourusername.github.io/MedTrack/
   ```

3. **Test signup:**
   - Create account
   - Check email
   - Click verification link
   - Should redirect to: `https://yourusername.github.io/MedTrack/auth/login.html` ✓

4. **Test password reset:**
   - Request password reset
   - Check email
   - Click reset link
   - Should redirect to: `https://yourusername.github.io/MedTrack/auth/update-password.html` ✓

5. **Check console:**
   ```javascript
   // Should see:
   Dynamic redirect URL: https://yourusername.github.io/MedTrack/auth/login.html
   ```

## 🔍 How the Code Works

### getRedirectUrl() Method

Located in `assets/js/auth.js`:

```javascript
getRedirectUrl(path) {
    // 1. Get current origin
    const origin = window.location.origin;
    // Examples:
    // - http://localhost:5500
    // - https://yourusername.github.io
    
    // 2. Detect if we're in a subdirectory (GitHub Pages)
    const pathname = window.location.pathname;
    // Examples:
    // - /MedTrack/auth/login.html → basePath = /MedTrack
    // - /auth/login.html → basePath = ''
    
    // 3. Combine origin + basePath + requested path
    const fullUrl = origin + basePath + path;
    
    return fullUrl;
}
```

### Usage in Code

**Signup:**
```javascript
const redirectUrl = this.getRedirectUrl('/auth/login.html');
await this.supabase.auth.signUp({
    email: email,
    password: password,
    options: { emailRedirectTo: redirectUrl }
});
```

**Password Reset:**
```javascript
const redirectUrl = this.getRedirectUrl('/auth/update-password.html');
await this.supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl
});
```

## 🎯 Advantages

### ✅ Single Codebase
- No environment-specific code
- No build process needed
- Same code works everywhere

### ✅ Easy Testing
- Test locally with `localhost`
- Deploy to production without changes
- Switch between environments seamlessly

### ✅ Flexible Deployment
- Works on GitHub Pages
- Works with custom domains
- Works on any static host

### ✅ Automatic Detection
- Detects localhost automatically
- Detects GitHub Pages automatically
- Detects subdirectory paths automatically

## 🐛 Troubleshooting

### Issue: "Invalid redirect URL" on signup/reset

**Problem:** Supabase rejects the redirect URL

**Solution:**
1. Check Supabase Dashboard → Authentication → URL Configuration
2. Make sure the **exact** URL is in the Redirect URLs list
3. Check browser console for the actual URL being used:
   ```javascript
   // Look for:
   Dynamic redirect URL: [the actual URL]
   ```
4. Add that exact URL to Supabase

### Issue: Redirects to wrong environment

**Problem:** Local app redirects to GitHub Pages (or vice versa)

**Solution:**
- Clear browser cache
- Check browser console for `Dynamic redirect URL:`
- Verify you're on the correct domain

### Issue: Email links don't work

**Problem:** Clicking email verification/reset links shows error

**Checklist:**
1. ✓ Both local and production URLs in Supabase?
2. ✓ Wildcard patterns (`**`) included?
3. ✓ Exact paths added? (`/auth/login.html`, `/auth/update-password.html`)
4. ✓ Both `http://` and `https://` if needed?
5. ✓ Both `localhost` and `127.0.0.1` if needed?

## 🔐 Security Notes

### ✅ Safe Practices
- All redirect URLs must be explicitly added to Supabase
- Supabase validates redirect URLs before using them
- Dynamic detection happens client-side (transparent to user)
- No security impact from detecting environment

### ⚠️ Important
- Always use HTTPS in production (GitHub Pages does this automatically)
- Never expose service_role keys (only use anon key)
- Keep Row Level Security (RLS) enabled

## 📊 Environment Detection

You can check the current environment programmatically:

```javascript
const authHandler = new AuthHandler();
const env = authHandler.getEnvironmentInfo();

console.log(env);
// Output:
// {
//   origin: "http://localhost:5500",
//   isLocal: true,
//   isGitHubPages: false,
//   isProduction: false,
//   currentUrl: "http://localhost:5500/auth/login.html"
// }
```

## 🚀 Deployment Workflow

### One-Time Setup (Already Done ✓)
1. ✓ Configure Supabase with both local and production URLs
2. ✓ Code uses `getRedirectUrl()` method (done!)
3. ✓ No environment variables needed

### Every Day Development
1. **Local Development:**
   ```bash
   # Start local server
   python -m http.server 5500
   
   # Code, test, commit
   git add .
   git commit -m "Your changes"
   ```

2. **Deploy to Production:**
   ```bash
   # Push to GitHub
   git push origin main
   
   # GitHub Actions automatically deploys
   # App works immediately on GitHub Pages
   ```

3. **Test Production:**
   - Visit `https://yourusername.github.io/MedTrack/`
   - Test auth flows
   - Everything works automatically ✓

## 📝 Configuration Checklist

Use this checklist to verify your setup:

### Supabase Configuration
- [ ] Supabase Dashboard → Authentication → URL Configuration opened
- [ ] Site URL set (either local or production)
- [ ] Added: `http://localhost:5500/**`
- [ ] Added: `http://localhost:5500/auth/**`
- [ ] Added: `http://127.0.0.1:5500/**`
- [ ] Added: `https://yourusername.github.io/**`
- [ ] Added: `https://yourusername.github.io/MedTrack/**`
- [ ] Added: `https://yourusername.github.io/MedTrack/auth/**`
- [ ] Saved changes

### Local Testing
- [ ] Local server running (port 5500)
- [ ] Can sign up
- [ ] Email verification link works
- [ ] Redirects to `localhost` URLs
- [ ] Password reset works locally

### Production Testing
- [ ] Pushed to GitHub (main branch)
- [ ] GitHub Actions deployed successfully
- [ ] Can access GitHub Pages URL
- [ ] Can sign up
- [ ] Email verification link works
- [ ] Redirects to GitHub Pages URLs
- [ ] Password reset works in production

## 🎉 Benefits Summary

| Aspect | Before | After |
|--------|--------|-------|
| **Code Changes** | Manual URL changes | ✅ Automatic |
| **Testing** | Hardcoded URLs | ✅ Dynamic |
| **Deployment** | Update config | ✅ Push & deploy |
| **Maintenance** | High | ✅ Low |
| **Flexibility** | Limited | ✅ Works anywhere |

## 💡 Advanced: Custom Domains

If you add a custom domain later:

1. **Add to GitHub Pages:**
   - Settings → Pages → Custom domain
   - Enter: `medtrack.yourdomain.com`

2. **Add to Supabase:**
   ```
   https://medtrack.yourdomain.com/**
   https://medtrack.yourdomain.com/auth/**
   ```

3. **That's it!** App automatically detects and uses the custom domain.

## 📚 Related Documentation

- **Supabase Setup**: `docs/SETUP.md`
- **Deployment**: `docs/GITHUB_PAGES_DEPLOYMENT.md`
- **Quick Start**: `docs/QUICK_START.md`

---

**Your app now works seamlessly in all environments! 🌍🚀**

No more manual URL changes - develop locally, deploy to production with a single push!

