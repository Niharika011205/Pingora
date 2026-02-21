# Quick Start Guide

Get your real-time chat app running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- A code editor

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

This installs all required packages including Next.js, Convex, Clerk, and UI components.

### 2. Set Up Convex

Open a terminal and run:

```bash
npx convex dev
```

**What happens:**
- You'll be prompted to log in or create a Convex account
- A new project will be created
- Your database schema will be pushed
- You'll receive a `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL`

**Keep this terminal running!**

### 3. Configure Environment Variables

The `.env.local` file already has your Clerk credentials. Now add the Convex URLs:

```env
# Clerk Authentication (already configured)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YW11c2VkLWJsb3dmaXNoLTUxLmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_t1lVIco9JU9X8Oy70gMc1gkltICZDoZwybHOI1B1d1
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Convex (add these from 'npx convex dev' output)
CONVEX_DEPLOYMENT=dev:your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

### 4. Start Next.js Development Server

Open a **new terminal** (keep Convex running) and run:

```bash
npm run dev
```

### 5. Open Your Browser

Navigate to: **http://localhost:3000**

You'll be redirected to sign in!

## First Time Setup

### Create Your First Account

1. Click "Sign up" or go to http://localhost:3000/sign-up
2. Enter your email and password
3. You'll be redirected to the chat interface

### Test Real-Time Features

1. **Open a second browser** (or incognito window)
2. Sign up with a different email
3. In the first browser:
   - Click "Users" tab
   - Click on the second user
4. Start chatting!
5. Watch messages appear in real-time ✨

## What You Should See

### Main Interface

```
┌─────────────────────────────────────────────────┐
│  Chat App                          [User] [👤]  │
├──────────────┬──────────────────────────────────┤
│              │                                   │
│ Conversations│  Select a conversation to start  │
│    Users     │         chatting                 │
│              │                                   │
│ [Search...]  │  Or choose a user from the       │
│              │         Users tab                │
│ User 1  ●    │                                   │
│ User 2       │                                   │
│              │                                   │
└──────────────┴──────────────────────────────────┘
```

### Chat Window

```
┌─────────────────────────────────────────────────┐
│  Chat App                          [User] [👤]  │
├──────────────┬──────────────────────────────────┤
│              │ ← [User 2] ●                     │
│ Conversations├──────────────────────────────────┤
│    Users     │                                   │
│              │     Hello! 👋                     │
│ [Search...]  │     2:34 PM                       │
│              │                                   │
│ User 2  ●  1 │                      Hi there!    │
│              │                      2:35 PM      │
│              │                                   │
│              │ User 2 is typing...               │
│              ├──────────────────────────────────┤
│              │ [Type a message...] [Send]       │
└──────────────┴──────────────────────────────────┘
```

## Testing Features

### ✅ Real-Time Messaging

1. Send a message from User 1
2. See it appear instantly for User 2
3. No refresh needed!

### ✅ Online Status

- Green dot = user is online
- Gray = user is offline
- Updates automatically

### ✅ Typing Indicators

1. Start typing in User 1's window
2. User 2 sees "User 1 is typing..."
3. Disappears after 2 seconds of inactivity

### ✅ Unread Counts

1. User 2 sends a message
2. User 1 sees a badge with unread count
3. Badge disappears when conversation is opened

### ✅ Smart Auto-Scroll

1. Scroll up to read old messages
2. New message arrives
3. See "↓ New Messages" button
4. Click to scroll to bottom

### ✅ Search Users

1. Click "Users" tab
2. Type in search box
3. Results filter in real-time

### ✅ Responsive Design

1. Resize browser window
2. On mobile: toggle between list and chat
3. On desktop: see both side-by-side

## Common Issues

### "Cannot connect to Convex"

**Solution**: Make sure `npx convex dev` is running in a terminal

### "Authentication failed"

**Solution**: 
1. Check `.env.local` has correct Clerk keys
2. Restart Next.js dev server: `npm run dev`

### "User not syncing"

**Solution**:
1. Sign out and sign in again
2. Check browser console for errors
3. Verify Convex is running

### TypeScript errors

**Solution**:
1. Run `npm install` again
2. Delete `.next` folder
3. Restart dev server

## Project Structure

```
├── app/
│   ├── (auth)/              # Sign in/up pages
│   ├── (main)/              # Main chat interface
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/
│   ├── ui/                  # Reusable UI components
│   ├── chat-window.tsx      # Chat interface
│   ├── conversation-list.tsx # Conversation sidebar
│   ├── message-input.tsx    # Message input field
│   ├── message-list.tsx     # Message display
│   ├── navbar.tsx           # Top navigation
│   ├── typing-indicator.tsx # "User is typing..."
│   └── user-list.tsx        # User search/list
├── convex/
│   ├── schema.ts            # Database schema
│   ├── users.ts             # User functions
│   ├── conversations.ts     # Conversation functions
│   ├── messages.ts          # Message functions
│   └── typing.ts            # Typing indicators
├── hooks/
│   ├── use-current-user.ts  # Get current user
│   └── use-online-status.ts # Manage online status
├── lib/
│   ├── convex-client-provider.tsx # Convex + Clerk setup
│   └── utils.ts             # Helper functions
└── middleware.ts            # Auth middleware
```

## Key Technologies

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe code
- **Convex**: Real-time database and backend
- **Clerk**: Authentication
- **Tailwind CSS**: Styling
- **shadcn/ui**: UI components
- **Radix UI**: Accessible primitives
- **Lucide**: Icons

## Development Commands

```bash
# Start Next.js dev server
npm run dev

# Start Convex dev server
npx convex dev

# Build for production
npm run build

# Start production server
npm start

# Open Convex dashboard
npx convex dashboard

# Deploy Convex to production
npx convex deploy
```

## Next Steps

### Customize the App

1. **Change colors**: Edit `app/globals.css`
2. **Update branding**: Modify `components/navbar.tsx`
3. **Add features**: See `README.md` for ideas

### Deploy to Production

See `DEPLOYMENT.md` for complete deployment guide to Vercel.

### Add More Features

Ideas to extend the app:
- Group chats (schema already supports it!)
- File uploads
- Message reactions (schema ready)
- Voice/video calls
- Push notifications
- Read receipts
- Message editing
- User profiles

## Learning Resources

- **Convex Tutorial**: https://docs.convex.dev/tutorial
- **Clerk Quickstart**: https://clerk.com/docs/quickstarts/nextjs
- **Next.js App Router**: https://nextjs.org/docs/app
- **Tailwind CSS**: https://tailwindcss.com/docs

## Getting Help

If you run into issues:

1. Check the console for errors
2. Review the troubleshooting section above
3. Check Convex dashboard for backend errors
4. Verify environment variables are correct

## Tips for Development

### Hot Reload

Both Convex and Next.js support hot reload:
- Change a React component → instant update
- Change a Convex function → auto-redeploy

### Debugging

**Frontend**:
- Open browser DevTools (F12)
- Check Console tab for errors
- Use React DevTools extension

**Backend**:
- Check terminal running `npx convex dev`
- Add `console.log()` in Convex functions
- View logs in Convex dashboard

### Database Inspection

```bash
npx convex dashboard
```

- Browse all tables
- View and edit data
- Run queries manually
- Monitor function calls

## Success Checklist

- [ ] Dependencies installed
- [ ] Convex dev server running
- [ ] Environment variables configured
- [ ] Next.js dev server running
- [ ] Can access http://localhost:3000
- [ ] Can sign up/sign in
- [ ] Can see user list
- [ ] Can send messages
- [ ] Messages appear in real-time
- [ ] Online status works
- [ ] Typing indicators work
- [ ] Unread counts work

## Congratulations! 🎉

You now have a fully functional real-time chat application!

Explore the code, customize it, and make it your own. Happy coding! 🚀
