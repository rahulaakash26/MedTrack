# GitHub Actions Deployment Setup

## 🚀 Overview

Your MedTrack project uses GitHub Actions to automatically deploy to GitHub Pages with Supabase configuration injected securely from GitHub Secrets.

## 📋 What Was Fixed & Optimized

### ✅ 1. Fixed Config File Path
**Before:**
```bash
cat > publish/config.js  # Wrong - root location
```

**After:**
```bash
mkdir -p publish/config
cat > publish/config/config.js  # Correct - in config/ folder
```

### ✅ 2. Improved Variable Substitution
**Before:**
- Used direct variable expansion (could fail with special characters)

**After:**
- Uses heredoc with proper escaping
- Separate sed commands for safe replacement
- Handles special characters in URLs/keys

### ✅ 3. Excluded Unnecessary Files
**Added exclusions:**
- `config/config.js` - Don't copy local config (we generate it)
- `REORGANIZATION_COMPLETE.md` - Deployment-only doc

### ✅ 4. Enhanced Debugging Output
**Now shows:**
- Full directory structure
- All important folders (config/, assets/, auth/)
- Config file content verification
- SUPABASE_URL presence check

### ✅ 5. Better Verification
**Final verification:**
- Lists deployed files
- Checks for required directories
- Confirms folder structure is correct

## 🔧 How It Works

### Workflow Trigger
```yaml
on:
  push:
    branches:
      - main
```
Automatically runs when you push to the `main` branch.

### Steps

#### 1. Checkout Repository
```yaml
- uses: actions/checkout@v4
```
Gets your code from the repository.

#### 2. Prepare Publish Directory
```bash
# Copy all files except excluded ones
rsync -a --delete \
  --exclude='.github' \
  --exclude='config/config.js' \
  ./ publish/

# Create config with secrets
mkdir -p publish/config
cat > publish/config/config.js <<'EOF'
window.MEDTRACK_CONFIG = {
  SUPABASE_URL: '$SUPABASE_URL',
  SUPABASE_ANON_KEY: '$SUPABASE_ANON_KEY'
};
EOF

# Replace variables
sed -i "s|\$SUPABASE_URL|$SUPABASE_URL|g" publish/config/config.js
sed -i "s|\$SUPABASE_ANON_KEY|$SUPABASE_ANON_KEY|g" publish/config/config.js
```

#### 3. Deploy to GitHub Pages
```yaml
- uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./publish
    publish_branch: gh-pages
```

#### 4. Verify Deployment
Checks that all folders are deployed correctly.

## 🔐 Required GitHub Secrets

You need to add these secrets to your GitHub repository:

### Setting Up Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these two secrets:

#### SUPABASE_URL
```
Name: SUPABASE_URL
Value: https://your-project.supabase.co
```

#### SUPABASE_ANON_KEY
```
Name: SUPABASE_ANON_KEY
Value: your-anon-key-from-supabase
```

### Where to Find These Values

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → Use as `SUPABASE_URL`
   - **Project API keys** → **anon/public** → Use as `SUPABASE_ANON_KEY`

## 📁 What Gets Deployed

The workflow deploys to the `gh-pages` branch with this structure:

```
gh-pages branch/
├── index.html
├── README.md
├── assets/
│   ├── css/
│   │   ├── style.css
│   │   └── auth-style.css
│   ├── js/
│   │   ├── app.js
│   │   └── auth.js
│   └── images/
│       └── pill-icon.svg
├── auth/
│   ├── login.html
│   ├── signup.html
│   ├── reset-password.html
│   └── update-password.html
├── config/
│   ├── config.js           ← Generated with secrets
│   └── config.example.js
└── docs/
    └── (all documentation)
```

## 🧪 Testing the Workflow

### 1. Check Secrets Are Set

```bash
# Secrets should show as "✓" in GitHub Settings → Secrets
```

### 2. Push to Main Branch

```bash
git add .
git commit -m "Test deployment"
git push origin main
```

### 3. Monitor the Workflow

1. Go to your repository on GitHub
2. Click the **Actions** tab
3. Click on the latest workflow run
4. Watch each step execute

### 4. Check the Output

Look for these in the debugging output:

```
✓ Config directory created
✓ config.js file exists
✓ SUPABASE_URL found in config
✓ All folders deployed (assets, auth, config, docs)
```

### 5. Test the Deployed Site

1. Go to: `https://yourusername.github.io/MedTrack/`
2. Should redirect to login page
3. Check browser console - no 404 errors
4. Verify Supabase connects properly

## 🐛 Troubleshooting

### Issue: Config file not found in deployment

**Check:**
```yaml
- name: Show publish directory contents for debugging
```
Output should show `publish/config/config.js`

**Fix:** Secrets might not be set. Verify in GitHub Settings.

### Issue: Variables not replaced (shows $SUPABASE_URL literally)

**Check:**
The debug output should show actual URLs, not `$SUPABASE_URL`

**Fix:** 
- Verify secrets are named exactly: `SUPABASE_URL` and `SUPABASE_ANON_KEY`
- No spaces or typos

### Issue: 404 on deployed site

**Check:**
- Verify `gh-pages` branch exists
- Check GitHub Pages is enabled in Settings → Pages
- Make sure source is set to `gh-pages` branch

**Fix:**
1. Settings → Pages
2. Source: Deploy from branch
3. Branch: `gh-pages` / `/ (root)`
4. Save

### Issue: Authentication not working on deployed site

**Check:**
1. Browser console for errors
2. Network tab - is config.js loading?
3. Supabase redirect URLs

**Fix:**
Update Supabase redirect URLs to include your GitHub Pages URL:
```
https://yourusername.github.io/MedTrack/**
https://yourusername.github.io/MedTrack/auth/**
```

## 📊 Workflow Status Badge

Add this to your README.md to show deployment status:

```markdown
![Deploy Status](https://github.com/yourusername/MedTrack/actions/workflows/deploy.yml/badge.svg)
```

## 🔄 Manual Deployment

You can also trigger deployment manually (if you uncomment `workflow_dispatch`):

1. Uncomment these lines in deploy.yml:
```yaml
workflow_dispatch:
```

2. Go to Actions → Select workflow → Run workflow

## 🎯 Optimization Summary

| Aspect | Before | After | Improvement |
|--------|--------|-------|-------------|
| Config location | Root | `config/` folder | ✅ Matches structure |
| Variable safety | Direct | sed replacement | ✅ Handles special chars |
| Debugging | Basic | Comprehensive | ✅ Better troubleshooting |
| Verification | Minimal | Full structure check | ✅ Catches issues early |
| Exclusions | Basic | Complete | ✅ Cleaner deployment |

## 🚀 Best Practices

### 1. Never Commit Secrets
- ✅ Use GitHub Secrets
- ❌ Don't hardcode in files
- ❌ Don't commit `config/config.js`

### 2. Test Locally First
- Run `rsync` command locally to verify
- Check `publish/` folder before pushing

### 3. Monitor Workflows
- Check Actions tab after each push
- Review debug output for errors

### 4. Keep Secrets Updated
- Rotate keys periodically
- Update secrets in GitHub when changed

### 5. Review Deployment
- Check deployed site after each push
- Verify all pages work
- Test authentication flow

## 📝 Workflow File Location

```
.github/workflows/deploy.yml
```

This file is automatically executed by GitHub Actions on every push to main.

## 🔗 Related Documentation

- **Deployment Guide**: `docs/GITHUB_PAGES_DEPLOYMENT.md`
- **Project Structure**: `docs/PROJECT_STRUCTURE.md`
- **Quick Start**: `docs/QUICK_START.md`

---

**Your deployment workflow is now optimized and ready for production! 🎉**

