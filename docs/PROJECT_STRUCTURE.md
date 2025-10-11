# 📁 MedTrack Project Structure

## Overview

The project has been reorganized into a clean, professional structure that separates concerns and makes the codebase easier to maintain.

## 🗂️ Directory Structure

```
MedTrack/
│
├── 📄 index.html                      # Main application (keep at root for GitHub Pages)
├── 📄 README.md                       # Project documentation
├── 📄 .gitignore                      # Git ignore rules
│
├── 📁 assets/                         # All static assets
│   ├── 📁 css/                        # Stylesheets
│   │   ├── style.css                 # Main application styles
│   │   └── auth-style.css            # Authentication page styles
│   │
│   ├── 📁 js/                         # JavaScript files
│   │   ├── app.js                    # Main application logic
│   │   └── auth.js                   # Authentication handler
│   │
│   └── 📁 images/                     # Images and icons
│       └── pill-icon.svg             # App icon
│
├── 📁 auth/                           # Authentication pages
│   ├── login.html                    # Sign in page
│   ├── signup.html                   # Create account page
│   ├── reset-password.html           # Request password reset
│   └── update-password.html          # Set new password
│
├── 📁 config/                         # Configuration files
│   ├── config.js                     # Supabase credentials (gitignored)
│   └── config.example.js             # Template for config.js
│
└── 📁 docs/                           # Documentation
    ├── QUICK_START.md                # 5-minute setup guide ⭐
    ├── SETUP.md                      # Detailed Supabase setup
    ├── AUTH_README.md                # Authentication documentation
    ├── LOCAL_SERVER_GUIDE.md         # How to run locally
    ├── GITHUB_PAGES_DEPLOYMENT.md    # Deployment guide
    ├── CHECKLIST.md                  # Testing checklist
    ├── CHANGES_SUMMARY.md            # Feature change log
    └── PROJECT_STRUCTURE.md          # This file
```

## 📊 File Organization Logic

### `/` (Root)
- **Purpose**: Entry point and configuration
- **Files**: 
  - `index.html` - Must be at root for GitHub Pages default serving
  - `README.md` - Project overview and quick start
  - `.gitignore` - Git configuration

### `/assets/` 
- **Purpose**: All static assets organized by type
- **Why**: Industry standard, clear separation of concerns

#### `/assets/css/`
- **style.css** - Main application styles (medicines list, modals, etc.)
- **auth-style.css** - Authentication page styles (login, signup, etc.)

#### `/assets/js/`
- **app.js** - Main application logic (MedicineTracker class)
- **auth.js** - Authentication handler (AuthHandler class)

#### `/assets/images/`
- **pill-icon.svg** - App icon used in UI and notifications

### `/auth/`
- **Purpose**: All authentication-related pages
- **Why**: Groups related functionality, easier to secure/manage
- **Pages**:
  - `login.html` - Main entry point for unauthenticated users
  - `signup.html` - New user registration
  - `reset-password.html` - Password recovery request
  - `update-password.html` - Set new password from email link

### `/config/`
- **Purpose**: Configuration files
- **Why**: Separates sensitive configuration from code
- **Files**:
  - `config.js` - Your actual Supabase credentials (gitignored)
  - `config.example.js` - Template for other developers

### `/docs/`
- **Purpose**: All project documentation
- **Why**: Keeps docs separate from code, easier to find
- **Files**: Setup guides, API docs, deployment instructions

## 🔗 Path References

### From Root (`index.html`)
```html
<!-- CSS -->
<link rel="stylesheet" href="assets/css/style.css">
<link rel="stylesheet" href="assets/css/auth-style.css">

<!-- JavaScript -->
<script src="config/config.js"></script>
<script src="assets/js/auth.js"></script>
<script src="assets/js/app.js"></script>

<!-- Images -->
<img src="assets/images/pill-icon.svg">
```

### From Auth Pages (`auth/*.html`)
```html
<!-- CSS -->
<link rel="stylesheet" href="../assets/css/style.css">
<link rel="stylesheet" href="../assets/css/auth-style.css">

<!-- JavaScript -->
<script src="../config/config.js"></script>
<script src="../assets/js/auth.js"></script>

<!-- Navigation -->
<a href="../index.html">Go to App</a>
<a href="signup.html">Sign Up</a>
```

### In JavaScript (`assets/js/app.js`)
```javascript
// Redirects
window.location.href = 'auth/login.html';

// Images in notifications
icon: 'assets/images/pill-icon.svg'
```

### In JavaScript (`assets/js/auth.js`)
```javascript
// Redirects (from auth pages)
window.location.href = '../index.html';

// Redirects (from main app)
window.location.href = 'auth/login.html';
```

## 🎯 Benefits of This Structure

### 1. **Clarity**
- Easy to find what you're looking for
- Clear separation of concerns
- Logical grouping of related files

### 2. **Scalability**
- Easy to add new features
- Easy to add new pages
- Room for growth (more assets, more docs)

### 3. **Maintainability**
- Changes are easier to locate
- Clear dependencies
- Professional organization

### 4. **Collaboration**
- New developers can navigate easily
- Standard industry structure
- Clear documentation location

### 5. **Security**
- Config files isolated
- Easy to secure sensitive files
- Clear gitignore patterns

## 🔄 Migration Notes

### What Changed

**Before:**
```
MedTrack/
├── All HTML files in root
├── All CSS files in root
├── All JS files in root
├── All MD files in root
├── Images in root
└── Config files in root
```

**After:**
```
MedTrack/
├── index.html (only main page at root)
├── Organized folders
│   ├── assets/ (css, js, images)
│   ├── auth/ (auth pages)
│   ├── config/ (config files)
│   └── docs/ (documentation)
└── README.md (main documentation)
```

### File Movements

| Old Location | New Location |
|-------------|--------------|
| `style.css` | `assets/css/style.css` |
| `auth-style.css` | `assets/css/auth-style.css` |
| `app.js` | `assets/js/app.js` |
| `auth.js` | `assets/js/auth.js` |
| `pill-icon.svg` | `assets/images/pill-icon.svg` |
| `login.html` | `auth/login.html` |
| `signup.html` | `auth/signup.html` |
| `reset-password.html` | `auth/reset-password.html` |
| `update-password.html` | `auth/update-password.html` |
| `config.js` | `config/config.js` |
| `config.example.js` | `config/config.example.js` |
| All `*.md` files | `docs/*.md` |

### Path Updates

All file references have been updated:
- ✅ HTML files updated with new asset paths
- ✅ JavaScript files updated with new redirect paths
- ✅ CSS files (no changes needed, no imports)
- ✅ Image references updated
- ✅ Config paths updated
- ✅ .gitignore updated

### Testing Checklist

After reorganization, test these:
- [ ] Main app loads at `http://localhost:5500/`
- [ ] Redirects to `auth/login.html` if not logged in
- [ ] Login page loads correctly with styles
- [ ] Signup page loads correctly
- [ ] Can create account and login
- [ ] After login, redirects to main app
- [ ] CSS loads correctly on all pages
- [ ] JavaScript executes without errors
- [ ] Images display correctly
- [ ] Config file loads (check browser console)
- [ ] Logout redirects to login page
- [ ] Password reset flow works
- [ ] Browser notifications work (icon loads)

## 📝 Developer Notes

### Adding New Files

**New CSS file:**
```
Location: assets/css/your-file.css
Reference: <link rel="stylesheet" href="assets/css/your-file.css">
```

**New JS file:**
```
Location: assets/js/your-file.js
Reference: <script src="assets/js/your-file.js"></script>
```

**New auth page:**
```
Location: auth/your-page.html
Must use relative paths: ../assets/css/...
```

**New documentation:**
```
Location: docs/YOUR_DOC.md
Link from README: [Title](docs/YOUR_DOC.md)
```

**New image:**
```
Location: assets/images/your-image.png
Reference: <img src="assets/images/your-image.png">
```

### Best Practices

1. **Always use relative paths** - Works locally and on any server
2. **Keep assets organized** - Don't mix CSS/JS/images
3. **Document new features** - Add to appropriate doc in `docs/`
4. **Update README** - If adding major features
5. **Test all pages** - After adding new assets
6. **Check console** - For any 404 errors

### Common Issues

**Q: Page loads but no styles**
- Check CSS paths are correct
- Check browser console for 404 errors
- Verify files moved to correct location

**Q: JavaScript errors about missing files**
- Check script src paths in HTML
- Check redirect paths in JS files
- Verify config.js is in config/ folder

**Q: Images not loading**
- Check image src paths
- Verify images are in assets/images/
- Check browser console for 404 errors

**Q: Config not loading**
- Verify config/config.js exists
- Check script tag in HTML files
- Look for errors in browser console

## 🎨 Customization

### To Add a New Theme

1. Create `assets/css/theme-dark.css`
2. Add link in `index.html` and auth pages
3. Add theme toggle in app.js

### To Add New Features

1. If new page: Add to `/auth/` or keep at root
2. If new assets: Add to appropriate `/assets/` folder
3. If new docs: Add to `/docs/`
4. Update README.md with new feature

### To Support More Languages

1. Create `assets/js/i18n.js`
2. Add translation files: `assets/i18n/en.json`, etc.
3. Update all HTML files
4. Document in `docs/`

---

**This structure is designed to scale with your project while remaining simple and intuitive! 🚀**

