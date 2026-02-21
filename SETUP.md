# Complete Setup Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages:
- Next.js 14
- TypeScript
- Convex
- Clerk
- Tailwind CSS
- shadcn/ui components
- Radix UI primitives
- Lucide icons

### 2. Set Up Clerk Authentication

1. Go to https://clerk.com
2. Sign up or log in
3. Click "Add application"
4. Choose authentication methods (Email, Google, GitHub, etc.)
5. Copy your API keys from the dashboard

### 3. Set Up Convex Backend

```bash
npx convex dev
```

This command will:
- Prompt you to log in or create a Convex account
- Create a new Convex project
- Generate your deployment URL
- Push the schema to Convex
- Start the development server

Keep this terminal running!

### 4. Configure Environment Variables

Create `.env.local` file in the root directory:

```env
# Clerk - Get these from https://dashboard.clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Convex - Get these from running 'npx convex dev'
CONVEX_DEPLOYMENT=dev:xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_CONVEX_URL=https://xxxxxxxxxxxxxxxxxxxxx.convex.cloud
```

### 5. Start Development Server

Open a new terminal and run:

```bash
npm run dev
```

### 6. Test the Application

1. Open http://localhost:3000
2. You'll be redirected to sign-in
3. Create an account or sign in
4. You should see the chat interface

### 7. Test with Multiple Users

To test real-time features:
1. Open the app in a regular browser window
2. Open the app in an incognito/private window
3. Sign in with different accounts
4. Start chatting and see real-time updates!

## Troubleshooting

### Convex Connection Issues

If you see "Failed to connect to Convex":
- Make sure `npx convex dev` is running
- Check that `NEXT_PUBLIC_CONVEX_URL` is correct in `.env.local`
- Restart the Next.js dev server

### Clerk Authentication Issues

If authentication doesn't work:
- Verify your Clerk API keys are correct
- Check that you've added `http://localhost:3000` to allowed origins in Clerk dashboard
- Clear browser cookies and try again

### TypeScript Errors

If you see TypeScript errors:
- Run `npm install` again
- Delete `.next` folder and restart dev server
- Make sure all files are saved

### Module Not Found Errors

If you see "Module not found" errors:
- Check that the import path is correct
- Verify the file exists
- Restart the dev server

## Production Deployment

### Deploy Convex

```bash
npx convex deploy
```

This will:
- Deploy your Convex functions to production
- Give you a production URL
- Update your deployment settings

### Deploy to Vercel

1. Push code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. Go to https://vercel.com
3. Click "Import Project"
4. Select your GitHub repository
5. Add environment variables (same as `.env.local` but with production values)
6. Click "Deploy"

### Update Clerk for Production

1. Go to Clerk dashboard
2. Add your Vercel domain to allowed origins
3. Update redirect URLs to include your production domain

### Verify Production Deployment

1. Visit your Vercel URL
2. Sign in with a test account
3. Test all features:
   - User search
   - Sending messages
   - Real-time updates
   - Online status
   - Typing indicators

## Development Tips

### Hot Reload

Both Convex and Next.js support hot reload:
- Changes to React components reload instantly
- Changes to Convex functions redeploy automatically

### Database Inspection

View your Convex database:
```bash
npx convex dashboard
```

This opens a web interface where you can:
- Browse all tables
- View and edit data
- Run queries
- Monitor function calls

### Debugging

Add console.logs in Convex functions:
```typescript
export const myFunction = mutation({
  handler: async (ctx, args) => {
    console.log("Debug:", args);
    // Your code
  },
});
```

View logs in the Convex dev terminal.

### Testing Real-time Features

Use multiple browser windows:
- Regular window: User A
- Incognito window: User B
- Test messaging, typing, online status

## Common Commands

```bash
# Install dependencies
npm install

# Start Next.js dev server
npm run dev

# Start Convex dev server
npx convex dev

# Deploy Convex to production
npx convex deploy

# Build for production
npm run build

# Start production server
npm start

# Open Convex dashboard
npx convex dashboard
```

## Project Structure Explained

```
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth routes (sign-in, sign-up)
│   ├── (main)/              # Main app routes
│   ├── layout.tsx           # Root layout with providers
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── chat-window.tsx      # Main chat interface
│   ├── conversation-list.tsx # List of conversations
│   ├── message-input.tsx    # Message input field
│   ├── message-list.tsx     # Message display
│   ├── navbar.tsx           # Top navigation
│   ├── typing-indicator.tsx # "User is typing..."
│   └── user-list.tsx        # User search and list
├── convex/                  # Convex backend
│   ├── schema.ts            # Database schema
│   ├── users.ts             # User functions
│   ├── conversations.ts     # Conversation functions
│   ├── messages.ts          # Message functions
│   └── typing.ts            # Typing indicator functions
├── hooks/                   # Custom React hooks
│   ├── use-current-user.ts  # Get current user
│   └── use-online-status.ts # Manage online status
├── lib/                     # Utilities
│   ├── convex-client-provider.tsx # Convex + Clerk provider
│   └── utils.ts             # Helper functions
└── middleware.ts            # Clerk auth middleware
```

## Next Steps

After setup, you can:
1. Customize the UI colors in `tailwind.config.ts`
2. Add more features (file uploads, reactions, etc.)
3. Implement group chats (schema already supports it)
4. Add push notifications
5. Integrate voice/video calls

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Convex docs: https://docs.convex.dev
3. Review Clerk docs: https://clerk.com/docs
4. Review Next.js docs: https://nextjs.org/docs

## Security Notes

- Never commit `.env.local` to git (it's in `.gitignore`)
- Keep your API keys secret
- Use environment variables for all sensitive data
- Enable 2FA on Clerk and Convex accounts
- Review Clerk's security best practices
