# ✅ Setup Checklist

Use this checklist to ensure everything is set up correctly.

## Pre-Installation

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm or yarn installed (`npm --version`)
- [ ] Code editor ready (VS Code recommended)

## Installation

- [ ] Run `npm install`
- [ ] No errors during installation
- [ ] `node_modules` folder created

## Convex Setup

- [ ] Run `npx convex dev` in terminal 1
- [ ] Logged in or created Convex account
- [ ] Project created successfully
- [ ] Received `CONVEX_DEPLOYMENT` value
- [ ] Received `NEXT_PUBLIC_CONVEX_URL` value
- [ ] Added both values to `.env.local`
- [ ] Terminal shows "Watching for file changes..."
- [ ] Keep this terminal running ✅

## Environment Variables

Check your `.env.local` file has all these:

- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_bm9ibGUtZG9lLTU1...`
- [ ] `CLERK_SECRET_KEY=sk_test_MbJVqjMDfVa0oVGprYUhHrkxu5I1Urdsr10tHqQLJU`
- [ ] `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
- [ ] `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
- [ ] `CONVEX_DEPLOYMENT=dev:xxxxx` (from step above)
- [ ] `NEXT_PUBLIC_CONVEX_URL=https://xxxxx.convex.cloud` (from step above)

## Next.js Setup

- [ ] Run `npm run dev` in terminal 2 (new terminal)
- [ ] No errors in terminal
- [ ] Server started on http://localhost:3000
- [ ] Keep this terminal running ✅

## Browser Test

- [ ] Open http://localhost:3000
- [ ] Redirected to sign-in page
- [ ] Clerk sign-in UI loads correctly
- [ ] No errors in browser console (F12)

## First User Test

- [ ] Click "Sign up"
- [ ] Enter email and password
- [ ] Sign up successful
- [ ] Redirected to main chat interface
- [ ] See navbar with your name
- [ ] See "Conversations" and "Users" tabs
- [ ] No errors in browser console

## Second User Test (Real-Time)

- [ ] Open incognito/private window
- [ ] Go to http://localhost:3000
- [ ] Sign up with different email
- [ ] Sign up successful
- [ ] See main chat interface

## Real-Time Messaging Test

In first browser:
- [ ] Click "Users" tab
- [ ] See second user in list
- [ ] Second user shows green dot (online)
- [ ] Click on second user
- [ ] Chat window opens

In second browser:
- [ ] See conversation appear in list
- [ ] Unread badge shows "0"

In first browser:
- [ ] Type a message
- [ ] Click send or press Enter
- [ ] Message appears immediately

In second browser:
- [ ] Message appears immediately (no refresh!)
- [ ] Unread badge shows "1"
- [ ] Click conversation
- [ ] See message
- [ ] Unread badge disappears

## Feature Tests

### Typing Indicators
- [ ] In first browser, start typing
- [ ] In second browser, see "User is typing..."
- [ ] Stop typing
- [ ] Indicator disappears after 2 seconds

### Online Status
- [ ] Both users show green dot when online
- [ ] Close first browser tab
- [ ] In second browser, first user's dot disappears (may take 30 seconds)

### Unread Counts
- [ ] Send message from User 1
- [ ] User 2 sees unread badge
- [ ] User 2 opens conversation
- [ ] Badge disappears

### Auto-Scroll
- [ ] Send many messages (10+)
- [ ] Scroll up to read old messages
- [ ] Send new message from other user
- [ ] See "↓ New Messages" button
- [ ] Click button
- [ ] Scrolls to bottom

### User Search
- [ ] Click "Users" tab
- [ ] Type in search box
- [ ] Results filter instantly
- [ ] Clear search
- [ ] All users appear again

### Responsive Design
- [ ] Resize browser window to mobile size
- [ ] See conversation list only
- [ ] Click conversation
- [ ] See chat window only
- [ ] Click back button
- [ ] Return to conversation list
- [ ] Resize to desktop
- [ ] See both side-by-side

### Timestamps
- [ ] Send message
- [ ] See time only (e.g., "2:34 PM")
- [ ] In conversation list, see relative time (e.g., "Just now")

## Database Verification

- [ ] Run `npx convex dashboard` in new terminal
- [ ] Dashboard opens in browser
- [ ] See your project
- [ ] Click "Data"
- [ ] See tables: users, conversations, messages, typingIndicators, lastRead
- [ ] Click "users" table
- [ ] See both users
- [ ] Check "online" field is true for active users

## Console Checks

### Browser Console (F12)
- [ ] No red errors
- [ ] No warnings about missing modules
- [ ] WebSocket connection established (Network tab → WS)

### Convex Terminal
- [ ] No errors
- [ ] Shows function calls when you interact
- [ ] "Watching for file changes..."

### Next.js Terminal
- [ ] No errors
- [ ] Shows page requests
- [ ] No compilation errors

## Code Quality Checks

- [ ] All files created
- [ ] No TypeScript errors (after npm install)
- [ ] All imports resolve correctly
- [ ] No console.log statements left in production code

## Performance Checks

- [ ] Messages appear instantly (< 100ms)
- [ ] No lag when typing
- [ ] Smooth scrolling
- [ ] Fast page loads
- [ ] No memory leaks (check Task Manager)

## Security Checks

- [ ] `.env.local` in `.gitignore`
- [ ] No API keys in code
- [ ] Authentication required for all routes
- [ ] Can't access chat without signing in

## Production Readiness

- [ ] Run `npm run build`
- [ ] Build succeeds with no errors
- [ ] Run `npm start`
- [ ] Production server starts
- [ ] Test in production mode
- [ ] Everything works

## Optional: Deploy to Vercel

- [ ] Push code to GitHub
- [ ] Run `npx convex deploy`
- [ ] Note production Convex URLs
- [ ] Import to Vercel
- [ ] Add environment variables (production values)
- [ ] Deploy
- [ ] Update Clerk allowed origins
- [ ] Test production deployment
- [ ] All features work in production

## Troubleshooting

If any checkbox fails:

1. **Check TROUBLESHOOTING.md** for solutions
2. **Check browser console** for errors
3. **Check terminal output** for errors
4. **Restart servers** (Ctrl+C, then restart)
5. **Clear cache** (delete `.next` folder)
6. **Reinstall** (`rm -rf node_modules`, then `npm install`)

## Common Issues

### ❌ "Cannot connect to Convex"
**Solution:** Make sure `npx convex dev` is running

### ❌ "Authentication failed"
**Solution:** Check `.env.local` has correct Clerk keys

### ❌ Messages not real-time
**Solution:** Check WebSocket connection in Network tab

### ❌ TypeScript errors
**Solution:** Run `npm install`, restart VS Code

### ❌ Build fails
**Solution:** Fix TypeScript errors, check imports

## Success Criteria

You're ready to go when:

✅ Both terminals running without errors
✅ Can sign up and sign in
✅ Can see other users
✅ Can send messages
✅ Messages appear in real-time
✅ All features work as expected
✅ No errors in console
✅ Build succeeds

## Final Check

- [ ] All features tested ✅
- [ ] No errors anywhere ✅
- [ ] Real-time updates working ✅
- [ ] Ready to customize ✅
- [ ] Ready to deploy ✅

## 🎉 Congratulations!

If all checkboxes are checked, your real-time chat app is fully functional and ready for:
- Customization
- Adding features
- Deployment to production
- Showing to users

**Happy coding!** 🚀

---

## Quick Reference

**Start Development:**
```bash
# Terminal 1
npx convex dev

# Terminal 2
npm run dev
```

**View Database:**
```bash
npx convex dashboard
```

**Build for Production:**
```bash
npm run build
npm start
```

**Deploy:**
```bash
npx convex deploy  # Deploy backend
# Then deploy to Vercel via dashboard
```
