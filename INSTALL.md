# Installation Guide

Complete guide to install and run the Real-Time Chat Application.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A code editor (VS Code recommended)

## Quick Start (3 Steps)

### 1. Install Dependencies

```bash
npm install
```

This installs all required packages:
- Next.js 14
- TypeScript
- Convex (real-time database)
- Clerk (authentication)
- Tailwind CSS
- shadcn/ui components
- emoji-picker-react
- Radix UI primitives
- Lucide icons

### 2. Set Up Convex Backend

```bash
npx convex dev
```

This will:
- Prompt you to log in or create a Convex account (free)
- Create a new Convex project
- Deploy your database schema
- Generate TypeScript types
- Give you two URLs to add to `.env.local`:
  - `CONVEX_DEPLOYMENT=dev:xxxxx`
  - `NEXT_PUBLIC_CONVEX_URL=https://xxxxx.convex.cloud`

**Keep this terminal running!**

### 3. Start Next.js Development Server

Open a **new terminal** and run:

```bash
npm run dev
```

### 4. Open Your Browser

Navigate to: **http://localhost:3000**

You'll be redirected to the sign-in page!

## Environment Variables

Your `.env.local` file should contain:

```env
# Clerk Authentication (Already configured)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_bm9ibGUtZG9lLTU1LmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_MbJVqjMDfVa0oVGprYUhHrkxu5I1Urdsr10tHqQLJU
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Convex (Add these from 'npx convex dev' output)
CONVEX_DEPLOYMENT=anonymous:anonymous-new_one
NEXT_PUBLIC_CONVEX_URL=http://127.0.0.1:3210
```

## Features Included

✅ **Authentication**
- Email/password sign-in
- Google OAuth (enabled)
- Secure session management

✅ **Real-Time Messaging**
- Instant message delivery
- WebSocket-based updates
- Message history

✅ **Message Features**
- Emoji reactions (👍❤️😂😮😢🎉)
- Delete your own messages
- Emoji picker for composing
- Message timestamps

✅ **User Features**
- Online/offline status (green dots)
- Typing indicators
- User search
- Profile pictures

✅ **UI/UX**
- Unread message counts
- Smart auto-scroll
- Responsive design (mobile + desktop)
- Full-screen interface
- Clean, modern design

## Testing the App

### Create Your First Account

1. Go to http://localhost:3000
2. Click "Sign up"
3. Enter email and password OR click "Continue with Google"
4. Sign up!

### Test Real-Time Features

1. Open a second browser window (incognito/private mode)
2. Go to http://localhost:3000
3. Sign up with a different email
4. In the first window:
   - Click "Users" tab
   - Click on the second user
5. Start chatting!
6. Watch messages appear instantly in both windows ✨

### Test Message Features

**React to Messages:**
- Hover over any message
- Click the 😊 smile icon
- Choose a reaction
- See it appear in real-time

**Delete Messages:**
- Hover over your own message
- Click the ⋮ three dots
- Click "Delete"
- Confirm

**Add Emojis:**
- Click the 😊 smile icon in message input
- Browse and select emojis
- Send your message

## Troubleshooting

### "Cannot connect to Convex"
- Make sure `npx convex dev` is running
- Check `.env.local` has correct Convex URLs
- Restart Next.js: `npm run dev`

### "Authentication failed"
- Clerk keys are already configured
- Try clearing browser cookies
- Restart dev server

### TypeScript errors
- Run `npm install` again
- Delete `.next` folder: `rmdir /s /q .next`
- Restart dev server

### Port already in use
```bash
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID [PID] /F

# Or use different port
npm run dev -- -p 3001
```

## Project Structure

```
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── sign-in/         # Sign-in page
│   │   └── sign-up/         # Sign-up page
│   ├── (main)/              # Main app
│   │   └── page.tsx         # Chat interface
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/
│   ├── ui/                  # UI components
│   │   ├── avatar.tsx
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dropdown-menu.tsx
│   │   └── scroll-area.tsx
│   ├── chat-window.tsx      # Chat interface
│   ├── conversation-list.tsx # Conversation sidebar
│   ├── message-item.tsx     # Individual message
│   ├── message-input.tsx    # Message input with emoji
│   ├── message-list.tsx     # Message display
│   ├── navbar.tsx           # Top navigation
│   ├── typing-indicator.tsx # Typing status
│   └── user-list.tsx        # User search/list
├── convex/
│   ├── schema.ts            # Database schema
│   ├── auth.config.ts       # Clerk auth config
│   ├── users.ts             # User functions
│   ├── conversations.ts     # Conversation functions
│   ├── messages.ts          # Message functions
│   └── typing.ts            # Typing indicators
├── hooks/
│   ├── use-current-user.ts  # Current user hook
│   └── use-online-status.ts # Online status hook
├── lib/
│   ├── convex-client-provider.tsx # Convex + Clerk setup
│   └── utils.ts             # Helper functions
├── .env.local               # Environment variables
├── middleware.ts            # Auth middleware
└── package.json             # Dependencies
```

## Development Commands

```bash
# Start Convex backend
npx convex dev

# Start Next.js frontend
npm run dev

# Build for production
npm run build

# Start production server
npm start

# View Convex dashboard
npx convex dashboard

# Deploy Convex to production
npx convex deploy
```

## Next Steps

### Customize Your App

1. **Change colors**: Edit `app/globals.css`
2. **Update branding**: Modify `components/navbar.tsx`
3. **Add features**: See `FEATURES.md` for ideas

### Deploy to Production

See `DEPLOYMENT.md` for complete deployment guide to Vercel.

### Add More Features

Ideas to extend the app:
- Group chats (schema ready!)
- File uploads
- Voice/video calls
- Push notifications
- Read receipts
- Message editing
- User profiles
- Dark mode

## Support

- **Documentation**: Check other .md files in the project
- **Convex Docs**: https://docs.convex.dev
- **Clerk Docs**: https://clerk.com/docs
- **Next.js Docs**: https://nextjs.org/docs

## Success Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Convex running (`npx convex dev`)
- [ ] Environment variables configured
- [ ] Next.js running (`npm run dev`)
- [ ] Can access http://localhost:3000
- [ ] Can sign up/sign in
- [ ] Can see user list
- [ ] Can send messages
- [ ] Messages appear in real-time
- [ ] Can add reactions
- [ ] Can delete messages
- [ ] Emoji picker works
- [ ] Google OAuth works

## 🎉 You're All Set!

Your production-ready real-time chat application is now running!

**Current Status:**
- ✅ Convex backend: Running on port 3210
- ✅ Next.js frontend: Running on port 3000
- ✅ All features: Enabled and working

Enjoy your chat app! 🚀
