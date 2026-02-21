# 🎯 Quick Command Reference

All commands you need to run your chat app.

## 🚀 First Time Setup

```bash
# 1. Install dependencies
npm install

# 2. Start Convex (Terminal 1 - keep running)
npx convex dev

# 3. Add Convex URLs to .env.local
# Copy CONVEX_DEPLOYMENT and NEXT_PUBLIC_CONVEX_URL from terminal

# 4. Start Next.js (Terminal 2 - keep running)
npm run dev

# 5. Open browser
# http://localhost:3000
```

## 📋 Daily Development

```bash
# Terminal 1: Start Convex
npx convex dev

# Terminal 2: Start Next.js
npm run dev

# Browser: Open app
# http://localhost:3000
```

## 🔍 Useful Commands

### View Database
```bash
npx convex dashboard
```

### Check Logs
```bash
# Convex logs: Check Terminal 1
# Next.js logs: Check Terminal 2
# Browser logs: F12 → Console
```

### Restart Everything
```bash
# Stop both terminals (Ctrl+C)
# Then restart:
npx convex dev    # Terminal 1
npm run dev       # Terminal 2
```

### Clear Cache
```bash
# Windows
rmdir /s /q .next
rmdir /s /q node_modules
del package-lock.json
npm install

# Then restart servers
```

## 🏗️ Build Commands

### Development Build
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Test Build Locally
```bash
npm run build
npm start
# Open http://localhost:3000
```

## 🚀 Deployment Commands

### Deploy Convex
```bash
npx convex deploy
# Copy production URLs for Vercel
```

### Deploy to Vercel (CLI)
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

## 🔧 Troubleshooting Commands

### Fix TypeScript Errors
```bash
# Restart TypeScript in VS Code
# Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

### Reinstall Dependencies
```bash
rmdir /s /q node_modules
del package-lock.json
npm install
```

### Reset Convex
```bash
# Stop convex (Ctrl+C)
npx convex dev --clear-all
# ⚠️ Warning: Deletes all data!
```

### Check Versions
```bash
node --version    # Should be 18+
npm --version
npx --version
```

## 📦 Package Management

### Install New Package
```bash
npm install package-name
```

### Update Packages
```bash
npm update
```

### Check for Updates
```bash
npm outdated
```

## 🧪 Testing Commands

### Run Linter
```bash
npm run lint
```

### Fix Linting Issues
```bash
npm run lint -- --fix
```

## 📊 Monitoring Commands

### Check Convex Status
```bash
npx convex dashboard
# View:
# - Database tables
# - Function logs
# - Performance metrics
```

### Check Build Size
```bash
npm run build
# Look for "First Load JS" in output
```

## 🔐 Environment Commands

### View Environment Variables
```bash
type .env.local
```

### Check Environment in App
```javascript
// In browser console
console.log(process.env.NEXT_PUBLIC_CONVEX_URL)
console.log(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)
```

## 🎨 Customization Commands

### Add shadcn/ui Component
```bash
npx shadcn-ui@latest add [component-name]
```

### Generate Tailwind Config
```bash
npx tailwindcss init -p
```

## 📱 Mobile Testing

### Test on Mobile Device
```bash
# Find your local IP
ipconfig

# Start dev server
npm run dev

# On mobile, visit:
# http://YOUR_IP:3000
```

## 🐛 Debug Commands

### Enable Verbose Logging
```bash
# Convex
CONVEX_LOG_LEVEL=debug npx convex dev

# Next.js
npm run dev -- --debug
```

### Check Port Usage
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000
```

### Kill Process on Port
```bash
# Find PID from above command
taskkill /PID [PID] /F
```

## 📚 Documentation Commands

### View README
```bash
type README.md
```

### Search Documentation
```bash
# Windows PowerShell
Select-String -Path *.md -Pattern "search-term"
```

## 🎯 Quick Fixes

### "Port 3000 already in use"
```bash
# Kill process
netstat -ano | findstr :3000
taskkill /PID [PID] /F

# Or use different port
npm run dev -- -p 3001
```

### "Cannot find module"
```bash
npm install
```

### "Convex connection failed"
```bash
# Check .env.local has correct URLs
type .env.local

# Restart Convex
npx convex dev
```

### "Authentication failed"
```bash
# Check Clerk keys in .env.local
type .env.local

# Restart Next.js
npm run dev
```

## 🔄 Git Commands

### Initialize Git
```bash
git init
git add .
git commit -m "Initial commit"
```

### Push to GitHub
```bash
git remote add origin https://github.com/username/repo.git
git branch -M main
git push -u origin main
```

### Create Branch
```bash
git checkout -b feature-name
```

## 📦 Backup Commands

### Backup Database
```bash
# Export from Convex dashboard
npx convex dashboard
# Data → Export
```

### Backup Code
```bash
git add .
git commit -m "Backup"
git push
```

## 🎉 Success Commands

### Check Everything Works
```bash
# 1. Dependencies installed?
dir node_modules

# 2. Convex running?
# Check Terminal 1 for "Watching for file changes..."

# 3. Next.js running?
# Check Terminal 2 for "Ready in X ms"

# 4. App accessible?
# Open http://localhost:3000

# 5. No errors?
# Check both terminals and browser console
```

## 📞 Help Commands

### Get Help
```bash
npm run dev -- --help
npx convex --help
vercel --help
```

### Check Documentation
```bash
# List all docs
dir *.md

# Read specific doc
type START-HERE.md
type QUICKSTART.md
type TROUBLESHOOTING.md
```

## 🎓 Learning Commands

### Explore Convex Functions
```bash
dir convex
type convex\schema.ts
type convex\users.ts
```

### Explore Components
```bash
dir components
type components\chat-window.tsx
```

## 💡 Pro Tips

### Run Multiple Commands
```bash
# Install and start in one go
npm install && npx convex dev
```

### Background Process
```bash
# Start in background (not recommended for dev)
start /B npm run dev
```

### Watch for Changes
```bash
# Both Convex and Next.js auto-reload
# Just save files and see changes!
```

## 🎯 Most Used Commands

```bash
# Start development (run these every time)
npx convex dev    # Terminal 1
npm run dev       # Terminal 2

# View database
npx convex dashboard

# Deploy to production
npx convex deploy
vercel --prod
```

## 📝 Command Cheat Sheet

| Task | Command |
|------|---------|
| Install | `npm install` |
| Start Convex | `npx convex dev` |
| Start Next.js | `npm run dev` |
| View Database | `npx convex dashboard` |
| Build | `npm run build` |
| Deploy Convex | `npx convex deploy` |
| Deploy Vercel | `vercel --prod` |
| Fix Errors | `npm install` |
| Clear Cache | `rmdir /s /q .next` |
| Restart TS | Ctrl+Shift+P → Restart TS |

## 🚀 Ready to Start?

```bash
npm install
npx convex dev
npm run dev
```

That's it! 🎉
