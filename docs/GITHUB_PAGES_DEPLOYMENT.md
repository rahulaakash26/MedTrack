# Deploying MedTrack to GitHub Pages

## 🚀 Quick Deployment Guide

### Step 1: Push Your Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - MedTrack with authentication"

# Add your GitHub repo as remote
git remote add origin https://github.com/yourusername/MedTrack.git

# Push to main branch
git push -u origin main
```

### Step 2: Enable GitHub Pages

1. Go to your GitHub repository
2. Click **Settings** → **Pages**
3. Under "Source", select **main** branch
4. Select **/ (root)** folder
5. Click **Save**
6. GitHub will give you a URL like: `https://yourusername.github.io/MedTrack/`

### Step 3: Update Supabase Configuration

**IMPORTANT**: Update your Supabase redirect URLs with your GitHub Pages URL.

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your MedTrack project
3. Go to **Authentication** → **URL Configuration**

**Site URL:**
```
https://yourusername.github.io
```

**Redirect URLs** (add all of these):
```
https://yourusername.github.io/MedTrack/**
https://yourusername.github.io/MedTrack/index.html
https://yourusername.github.io/MedTrack/auth/update-password.html
https://yourusername.github.io/MedTrack/auth/login.html
```

**Also keep localhost for development:**
```
http://localhost:5500/**
http://localhost:5500/auth/**
http://127.0.0.1:5500/**
http://127.0.0.1:5500/auth/**
```

## 🔄 How Authentication Redirects Work

### Default Behavior (Current Setup)

When users visit: `https://yourusername.github.io/MedTrack/`

```
1. GitHub Pages serves index.html
   ↓
2. app.js loads and checks authentication
   ↓
3a. If NOT logged in → Redirects to login.html
3b. If logged in → Shows main app
```

**This works perfectly!** ✅

### The Flow in Detail

```javascript
// In assets/js/app.js
async init() {
    const isAuthenticated = await this.checkAuthentication();
    
    if (!isAuthenticated) {
        window.location.href = 'auth/login.html';  // ← Redirects here!
        return;
    }
    // ... rest of app loads
}
```

## 🎯 Alternative: Use login.html as Default (Optional)

If you want users to land on the login page directly (avoiding the brief flash of index.html), you can create a redirect page:

### Option A: Create index.html Redirect

Rename current `index.html` to `app.html` and create a simple redirect:

**New index.html:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MedTrack - Redirecting...</title>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="config/config.js"></script>
    <script>
        // Immediately check auth and redirect
        (async function() {
            const LOCAL_CONFIG = window.MEDTRACK_CONFIG || {};
            const SUPABASE_URL = LOCAL_CONFIG.SUPABASE_URL;
            const SUPABASE_ANON_KEY = LOCAL_CONFIG.SUPABASE_ANON_KEY;
            
            if (window.supabase && SUPABASE_URL && SUPABASE_ANON_KEY) {
                const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                const { data: { user } } = await client.auth.getUser();
                
                if (user) {
                    window.location.href = 'app.html';
                } else {
                    window.location.href = 'auth/login.html';
                }
            } else {
                window.location.href = 'auth/login.html';
            }
        })();
    </script>
</head>
<body>
    <p style="text-align: center; padding: 50px;">Redirecting...</p>
</body>
</html>
```

**Then update assets/js/app.js redirect:**
```javascript
window.location.href = 'app.html'; // instead of 'index.html'
```

### Option B: Keep Current Setup (Recommended)

The current setup works fine! The redirect is so fast users won't notice. Keep it simple.

## ⚠️ Important: Don't Commit config.js

Make sure `config/config.js` is in `.gitignore` so your Supabase credentials aren't public!

**Check .gitignore contains:**
```
config/config.js
config.js
```

### For GitHub Pages, Use GitHub Secrets

Since GitHub Pages needs the config, create it differently:

**Option 1: Create config/config.js in a separate branch (gh-pages)**

1. Create a `gh-pages` branch
2. Add `config/config.js` there (not tracked in main)
3. Deploy from `gh-pages` branch

**Option 2: Use environment variable substitution**

Create a `config/config.template.js`:
```javascript
window.MEDTRACK_CONFIG = {
    SUPABASE_URL: '${SUPABASE_URL}',
    SUPABASE_ANON_KEY: '${SUPABASE_ANON_KEY}'
};
```

Use GitHub Actions to replace variables during deployment and output to `config/config.js`.

**Option 3: Public repo with separate private config (Recommended)**

Since the Supabase **anon key** is meant to be public (it's safe to expose), you can:

1. Commit `config/config.js` with your anon key (it's designed for public use)
2. Keep your Supabase project's Row Level Security (RLS) enabled
3. RLS protects your data even with public anon key

This is the **standard approach** for Supabase apps!

## 🔒 Security Checklist

Before deploying:

- [ ] ✅ Row Level Security (RLS) is enabled on `medicines` table
- [ ] ✅ RLS policies are created (from QUICK_START.md)
- [ ] ✅ Supabase redirect URLs include your GitHub Pages URL
- [ ] ✅ Test authentication flow on GitHub Pages
- [ ] ✅ Supabase anon key is in use (safe to be public)
- [ ] ✅ Email verification is enabled (for production)

## 🧪 Testing Your Deployment

After deploying to GitHub Pages:

1. **Test Redirect**:
   - Visit: `https://yourusername.github.io/MedTrack/`
   - Should redirect to `auth/login.html` ✓

2. **Test Signup**:
   - Create a new account
   - Check for verification email (if enabled)
   - Verify you can log in

3. **Test Main App**:
   - After login, should see main app
   - Add a medicine
   - Log out
   - Log back in
   - Verify medicine is still there

4. **Test Password Reset**:
   - Click "Forgot password?"
   - Enter email
   - Check email for reset link
   - Click link → should open `auth/update-password.html`
   - Set new password
   - Log in with new password

5. **Test Multiple Users**:
   - Create a second account (different email)
   - Add medicines
   - Verify each user sees only their own data

## 🐛 Common GitHub Pages Issues

### Issue 1: 404 on refresh

**Problem**: Refreshing `auth/login.html` or any page shows 404

**Solution**: GitHub Pages serves `index.html` by default. Direct navigation works, but:
- Bookmarks work fine
- Direct URL entry works fine (e.g., `https://yourusername.github.io/MedTrack/auth/login.html`)
- Refreshing works fine (for simple HTML apps like this)

This shouldn't be an issue for your app!

### Issue 2: Authentication not working

**Problem**: Can't log in on GitHub Pages but works locally

**Checklist**:
1. Check Supabase redirect URLs include GitHub Pages URL with `/auth/` paths
2. Check `config/config.js` is present and loaded
3. Check browser console for errors
4. Verify HTTPS (GitHub Pages uses HTTPS automatically)
5. Check if site URL is correct in Supabase

### Issue 3: "Invalid redirect URL" error

**Problem**: Supabase shows invalid redirect URL

**Solution**:
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your exact GitHub Pages URLs
3. Include wildcard: `https://yourusername.github.io/MedTrack/**`
4. Make sure there are no typos

### Issue 4: Changes not appearing

**Problem**: Updated code but GitHub Pages shows old version

**Solution**:
1. GitHub Pages can take 1-10 minutes to update
2. Clear browser cache (Ctrl+Shift+R)
3. Try incognito/private mode
4. Check GitHub Actions tab for deployment status

## 📱 Mobile Testing

GitHub Pages works great on mobile! Test:
- [ ] Login on mobile browser
- [ ] Add medicines
- [ ] UI is responsive
- [ ] Touch interactions work
- [ ] Dropdown menu works

## 🚀 Custom Domain (Optional)

Want to use your own domain instead of GitHub Pages URL?

1. **Buy a domain** (e.g., from Namecheap, Google Domains)
2. **Add to GitHub**:
   - Settings → Pages → Custom domain
   - Enter your domain (e.g., `medtrack.yourdomain.com`)
3. **Update DNS**:
   - Add CNAME record pointing to `yourusername.github.io`
4. **Update Supabase**:
   - Change Site URL to your custom domain
   - Update redirect URLs

## 📊 Deployment Checklist

Before going live:

- [ ] Code pushed to GitHub
- [ ] GitHub Pages enabled
- [ ] GitHub Pages URL works
- [ ] Supabase URLs updated
- [ ] RLS policies created
- [ ] Test signup flow
- [ ] Test login flow
- [ ] Test password reset
- [ ] Test on mobile
- [ ] Test in different browsers
- [ ] Check browser console for errors
- [ ] Verify multi-user isolation

## 🎉 You're Live!

Once deployed, share your app:
```
https://yourusername.github.io/MedTrack/
```

Users will:
1. Visit `https://yourusername.github.io/MedTrack/`
2. Get redirected to `auth/login.html` if not authenticated
3. Create account or log in
4. Access the main app to track their medicines
5. Each user's data is private and secure

---

**Enjoy your deployed MedTrack app! 🚀💊**

