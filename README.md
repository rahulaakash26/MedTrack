# 💊 MedTrack - Medicine Expiry Tracker

A simple and elegant web application to track your medicines and their expiry dates. Built with vanilla HTML, CSS, and JavaScript, powered by Supabase for authentication and data storage.

![MedTrack Banner](assets/images/pill-icon.svg)

## ✨ Features

- 🔐 **Secure Authentication** - Email-based signup/login with Supabase Auth
- 💊 **Medicine Management** - Add, edit, and delete medicines
- 📅 **Expiry Tracking** - Visual indicators for active, expiring soon, and expired medicines
- 🔍 **Search & Filter** - Quickly find medicines by name or notes
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🔔 **Notifications** - Get alerts for expired and expiring medicines
- 🌐 **Cloud Sync** - Your data is securely stored and synced across devices
- 🔒 **Privacy** - Each user's data is completely isolated

## 📁 Project Structure

```
MedTrack/
├── index.html                  # Main application page (protected)
├── README.md                   # This file
├── .gitignore                  # Git ignore rules
│
├── assets/                     # Static assets
│   ├── css/
│   │   ├── style.css          # Main application styles
│   │   └── auth-style.css     # Authentication page styles
│   ├── js/
│   │   ├── app.js             # Main application logic
│   │   └── auth.js            # Authentication handler
│   └── images/
│       └── pill-icon.svg      # App icon
│
├── auth/                       # Authentication pages
│   ├── login.html             # Sign in page
│   ├── signup.html            # Create account page
│   ├── reset-password.html    # Request password reset
│   └── update-password.html   # Set new password
│
├── config/                     # Configuration files
│   ├── config.js              # Supabase credentials (not committed)
│   └── config.example.js      # Template for config.js
│
└── docs/                       # Documentation
    ├── QUICK_START.md         # 5-minute setup guide
    ├── SETUP.md               # Detailed Supabase configuration
    ├── AUTH_README.md         # Authentication feature docs
    ├── LOCAL_SERVER_GUIDE.md  # How to run locally
    ├── GITHUB_PAGES_DEPLOYMENT.md  # Deployment guide
    ├── CHECKLIST.md           # Testing checklist
    └── CHANGES_SUMMARY.md     # Change log
```

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/MedTrack.git
cd MedTrack
```

### 2. Configure Supabase

1. Copy `config/config.example.js` to `config/config.js`
2. Fill in your Supabase credentials:

```javascript
window.MEDTRACK_CONFIG = {
    SUPABASE_URL: 'https://your-project.supabase.co',
    SUPABASE_ANON_KEY: 'your-anon-key-here'
};
```

3. Set up your Supabase database:
   - Follow the instructions in [`docs/QUICK_START.md`](docs/QUICK_START.md)
   - Create RLS policies (SQL provided in the guide)
   - Configure authentication URLs

### 3. Run Locally

#### Option A: VS Code Live Server (Recommended)
```bash
# Install Live Server extension in VS Code
# Right-click index.html → "Open with Live Server"
```

#### Option B: Python HTTP Server
```bash
python -m http.server 5500
# Open http://localhost:5500/auth/login.html
```

#### Option C: Node.js http-server
```bash
npm install -g http-server
http-server -p 5500 -o
```

See [`docs/LOCAL_SERVER_GUIDE.md`](docs/LOCAL_SERVER_GUIDE.md) for more options.

### 4. Access the App

Open your browser to:
- **Login**: `http://localhost:5500/auth/login.html`
- Or just: `http://localhost:5500/` (auto-redirects if not logged in)

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [QUICK_START.md](docs/QUICK_START.md) | 5-minute setup guide - **start here!** |
| [SETUP.md](docs/SETUP.md) | Detailed Supabase configuration |
| [AUTH_README.md](docs/AUTH_README.md) | Authentication features and API |
| [LOCAL_SERVER_GUIDE.md](docs/LOCAL_SERVER_GUIDE.md) | Running the app locally |
| [GITHUB_PAGES_DEPLOYMENT.md](docs/GITHUB_PAGES_DEPLOYMENT.md) | Deploy to GitHub Pages |
| [CHECKLIST.md](docs/CHECKLIST.md) | Implementation & testing checklist |

## 🎯 How It Works

### User Flow

```
1. User visits app → Redirected to auth/login.html
2. New user? → auth/signup.html → Create account
3. Existing user → Enter credentials → Login
4. After login → index.html (main app)
5. Add medicines, set expiry dates, get notifications
6. Data syncs to Supabase
7. Click user menu → Sign out
```

### Authentication

- **Sign Up**: Create account with email/password
- **Login**: Secure authentication via Supabase
- **Password Reset**: Email-based password recovery
- **Session Management**: Automatic session handling
- **Data Isolation**: Each user sees only their own medicines

### Medicine Tracking

- **Add Medicines**: Name, quantity, expiry date, notes
- **Visual Status**: Color-coded indicators (active, expiring, expired)
- **Search**: Find medicines by name or notes
- **Filter**: View all, active, expiring soon, or expired
- **Notifications**: Browser and in-app notifications

## 🔒 Security Features

- ✅ Row Level Security (RLS) in Supabase
- ✅ Email verification available
- ✅ Secure password hashing
- ✅ Session-based authentication
- ✅ User data isolation
- ✅ HTTPS on production (GitHub Pages)

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Hosting**: GitHub Pages (or any static host)
- **Design**: Mobile-first responsive design

## 📱 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🌐 Deployment

### GitHub Pages

1. Push code to GitHub
2. Enable GitHub Pages in repository settings
3. Update Supabase redirect URLs
4. Access at: `https://yourusername.github.io/MedTrack/`

See [`docs/GITHUB_PAGES_DEPLOYMENT.md`](docs/GITHUB_PAGES_DEPLOYMENT.md) for detailed instructions.

### Other Hosting Options

MedTrack works on any static file host:
- Netlify
- Vercel
- Cloudflare Pages
- Firebase Hosting
- AWS S3 + CloudFront

Just remember to update Supabase redirect URLs!

## 🧪 Testing

```bash
# Run linter (if applicable)
# npm run lint

# Manual testing checklist
# See docs/CHECKLIST.md

# Test locally before deploying
# 1. Create account
# 2. Add medicines
# 3. Test filters and search
# 4. Test logout/login
# 5. Verify data persistence
```

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Supabase](https://supabase.com/)
- Icons and design inspiration from various sources
- Community feedback and contributions

## 💡 Future Enhancements

Ideas for future versions:
- [ ] Dark mode theme
- [ ] Multi-language support
- [ ] Export/import data (CSV, PDF)
- [ ] Barcode scanning for medicines
- [ ] Medication reminders/schedules
- [ ] Family/group medicine sharing
- [ ] Medicine photos
- [ ] Prescription upload
- [ ] Analytics dashboard
- [ ] PWA (Progressive Web App) support
- [ ] Offline mode improvements

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/MedTrack/issues)
- **Documentation**: See `docs/` folder
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)

## ⚡ Quick Commands

```bash
# Start local server (Python)
python -m http.server 5500

# Start local server (Node)
http-server -p 5500

# Deploy to GitHub Pages
git add .
git commit -m "Update MedTrack"
git push origin main
```

---

**Made with ❤️ for better medicine management**

**Start tracking your medicines today!** 💊

