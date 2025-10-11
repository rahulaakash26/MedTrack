# Running MedTrack Locally - Step by Step Guide

## 🎯 Recommended Method: VS Code Live Server

### Step 1: Install Live Server Extension

1. Open VS Code
2. Click Extensions icon (or press `Ctrl+Shift+X`)
3. Search for "Live Server"
4. Install "Live Server" by Ritwick Dey
5. Reload VS Code if prompted

### Step 2: Start the Server

**Method A - Quick Start:**
- Open `index.html` or any HTML file in VS Code
- Right-click anywhere in the file
- Select "Open with Live Server"
- Server starts automatically on port 5500

**Method B - Using Status Bar:**
- Open any HTML file in the project
- Look at the bottom-right of VS Code
- Click "Go Live" button
- Server starts on port 5500

### Step 3: Access Your App

The browser will automatically open to:
```
http://localhost:5500/
```

Or you can manually navigate to:
- `http://localhost:5500/` - Auto-redirects to login if not authenticated
- `http://localhost:5500/auth/login.html` - Login page (start here)
- `http://localhost:5500/auth/signup.html` - Signup page
- `http://localhost:5500/index.html` - Main app (requires login)

### Step 4: Configure Supabase URLs

1. Open [Supabase Dashboard](https://app.supabase.com/)
2. Select your MedTrack project
3. Go to **Authentication** → **URL Configuration**
4. Set the following:

**Site URL:**
```
http://localhost:5500
```

**Redirect URLs** (add all of these):
```
http://localhost:5500/**
http://localhost:5500/auth/**
http://127.0.0.1:5500/**
http://127.0.0.1:5500/auth/**
http://localhost:5500/index.html
http://localhost:5500/auth/update-password.html
```

5. Click Save

### Step 5: Test Your Setup

1. Open `http://localhost:5500/` (will auto-redirect to `auth/login.html`)
2. Click "Create Account" → goes to `auth/signup.html`
3. Fill in email and password
4. Sign up (should redirect to login)
5. Log in with your credentials
6. Should redirect to main app (index.html)
7. Test adding a medicine
8. Click your email → Sign Out
9. Log back in - your medicine should still be there! ✅

## 🔧 Changing the Port

### VS Code Live Server - Change Default Port

1. Open VS Code Settings (`Ctrl+,`)
2. Search for: `liveServer.settings.port`
3. Change from `5500` to your desired port (e.g., `3000`)
4. Restart Live Server
5. **Remember to update Supabase URLs** with the new port!

### Custom Port Settings in Live Server

You can also customize:
- **Browser**: `liveServer.settings.CustomBrowser` - Choose which browser opens
- **Open Path**: `liveServer.settings.root` - Set root directory
- **Auto Refresh**: Enabled by default (changes auto-reload)

## 🐍 Alternative: Python HTTP Server

### Using Python 3

```powershell
# Navigate to MedTrack folder
cd D:\Projects\Practise\MedTrack

# Default port 8000
python -m http.server

# Custom port (e.g., 5500)
python -m http.server 5500

# With output
# Serving HTTP on :: port 5500 (http://[::]:5500/) ...
```

**Access**: `http://localhost:5500/login.html`

**Pros:**
- ✅ No installation needed (Python already installed on most systems)
- ✅ Simple one-command start

**Cons:**
- ❌ No auto-reload (must manually refresh browser after changes)
- ❌ Must manually navigate to URL

## 📦 Alternative: Node.js http-server

### Install (one-time)

```powershell
npm install -g http-server
```

### Run

```powershell
# Navigate to MedTrack folder
cd D:\Projects\Practise\MedTrack

# Default port 8080
http-server

# Custom port
http-server -p 5500

# With CORS enabled (if needed)
http-server -p 5500 --cors
```

**Access**: `http://localhost:5500/login.html`

**Useful flags:**
- `-p 5500` - Set port to 5500
- `-o` - Open browser automatically
- `-c-1` - Disable caching (for development)
- `--cors` - Enable CORS headers

**Full command for development:**
```powershell
http-server -p 5500 -o -c-1 --cors
```

## 🌐 Port Decision Logic

### How Ports are Chosen:

1. **VS Code Live Server**: Default `5500`
2. **Python http.server**: Default `8000`
3. **Node http-server**: Default `8080`
4. **Manual specification**: You choose via command-line flag

### Common Ports for Web Development:

- `3000` - React, Next.js default
- `4200` - Angular default
- `5173` - Vite default
- `5500` - VS Code Live Server default
- `8000` - Python default
- `8080` - Common alternative, Tomcat, http-server default
- `8888` - Jupyter notebooks

### Checking if a Port is Available:

**Windows PowerShell:**
```powershell
# Check if port 5500 is in use
netstat -ano | findstr :5500

# If output appears, port is in use
# If no output, port is available
```

**To free up a port (if needed):**
```powershell
# Find process using the port
netstat -ano | findstr :5500
# Note the PID (last column)

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

## 🚨 Troubleshooting

### Port Already in Use

**Error:** `Address already in use` or `Port 5500 is already in use`

**Solution:**
1. Close other instances of Live Server/servers
2. Or change to a different port
3. Or kill the process using that port (see above)

### Can't Access http://localhost:5500

**Possible Issues:**

1. **Server not running**
   - Check terminal for server output
   - Restart the server

2. **Wrong port**
   - Check what port the server actually started on
   - Update URL accordingly

3. **Firewall blocking**
   - Windows may ask for permission
   - Allow access for the server

### Supabase Not Working

**Issue:** "Authentication service not available"

**Solutions:**
1. Check `config.js` has correct Supabase credentials
2. Verify Supabase URLs include your current port
3. Check browser console for CORS errors
4. Make sure you're using `http://localhost` not `file://`

### Auto-Reload Not Working (Live Server)

1. Check Live Server is actually running (look for "Go Live" in status bar)
2. Save your file (Ctrl+S)
3. Check Live Server settings in VS Code
4. Try restarting Live Server

## 💡 Best Practices

### During Development:
- ✅ Use **VS Code Live Server** (easiest, auto-reload)
- ✅ Use a **consistent port** (don't keep changing)
- ✅ Keep Supabase URLs updated when changing ports
- ✅ Use `localhost` not `127.0.0.1` (or configure both in Supabase)

### Testing Authentication:
- ✅ Always test with `http://` protocol (not `file://`)
- ✅ Use real email addresses you can access
- ✅ Test in incognito/private mode to simulate new users
- ✅ Check browser console for errors

### Multiple Developers:
- ✅ Document which port everyone should use
- ✅ Add multiple ports to Supabase redirect URLs
- ✅ Use environment-specific configs if needed

## 🎯 Quick Reference

### Start Server (VS Code Live Server)
```
Right-click HTML file → "Open with Live Server"
```

### Start Server (Python)
```powershell
python -m http.server 5500
```

### Start Server (Node)
```powershell
http-server -p 5500 -o
```

### Update Supabase
```
Dashboard → Authentication → URL Configuration
Site URL: http://localhost:[YOUR_PORT]
Redirect URLs: http://localhost:[YOUR_PORT]/**
```

### Test App
```
http://localhost:[YOUR_PORT]/
```

---

## ✅ Quick Setup Checklist

- [ ] Install server (VS Code Live Server recommended)
- [ ] Start server and note the port number
- [ ] Update Supabase URLs with your port
- [ ] Run SQL setup from QUICK_START.md
- [ ] Open `http://localhost:[PORT]/` (auto-redirects to login)
- [ ] Create test account
- [ ] Test login flow
- [ ] Test adding medicines
- [ ] Test logout/login again

**You're ready to develop! 🚀**

