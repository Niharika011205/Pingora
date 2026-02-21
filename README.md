# Real-Time Chat Application

A production-ready, real-time one-on-one chat application built with Next.js, TypeScript, Convex, and Clerk.

## Live Demo : https://pingora-1rc21ny77-niharika011205s-projects.vercel.app

## Features

- **Real-time messaging** with instant updates using Convex subscriptions
- **User authentication** with Clerk (email/password + social login)
- **Online/offline status** with live indicators
- **Typing indicators** that show when someone is typing
- **Unread message counts** per conversation
- **Smart auto-scroll** with "New Messages" button
- **Responsive design** for desktop and mobile
- **Search functionality** to find users
- **Message timestamps** with smart formatting
- **Clean, modern UI** using Tailwind CSS and shadcn/ui

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Convex (database + backend + real-time)
- **Authentication**: Clerk
- **UI Components**: shadcn/ui, Radix UI
- **Icons**: Lucide React

## Project Structure

```
├── app/
│   ├── (auth)/
│   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   └── sign-up/[[...sign-up]]/page.tsx
│   ├── (main)/
│   │   └── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   │   ├── avatar.tsx
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── scroll-area.tsx
│   ├── chat-window.tsx
│   ├── conversation-list.tsx
│   ├── message-input.tsx
│   ├── message-list.tsx
│   ├── navbar.tsx
│   ├── typing-indicator.tsx
│   └── user-list.tsx
├── convex/
│   ├── conversations.ts
│   ├── messages.ts
│   ├── schema.ts
│   ├── typing.ts
│   └── users.ts
├── hooks/
│   ├── use-current-user.ts
│   └── use-online-status.ts
├── lib/
│   ├── convex-client-provider.tsx
│   └── utils.ts
└── middleware.ts
```

## Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd realtime-chat-app
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up Clerk**

- Go to [clerk.com](https://clerk.com) and create a new application
- Copy your API keys

4. **Set up Convex**

```bash
npx convex dev
```

This will:
- Create a new Convex project
- Generate your Convex URL
- Set up the database schema

5. **Configure environment variables**

Create a `.env.local` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Convex
CONVEX_DEPLOYMENT=dev:...
NEXT_PUBLIC_CONVEX_URL=https://...convex.cloud
```

## Running Locally

1. **Start Convex development server** (in one terminal):

```bash
npx convex dev
```

2. **Start Next.js development server** (in another terminal):

```bash
npm run dev
```

3. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## Deployment

### Deploy to Vercel

1. **Push your code to GitHub**

2. **Deploy Convex to production**

```bash
npx convex deploy
```

This will give you a production Convex URL.

3. **Deploy to Vercel**

- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Add environment variables:
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
  - `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
  - `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
  - `CONVEX_DEPLOYMENT` (from convex deploy)
  - `NEXT_PUBLIC_CONVEX_URL` (from convex deploy)
- Deploy

4. **Update Clerk settings**

- Add your Vercel domain to Clerk's allowed origins
- Update redirect URLs in Clerk dashboard

## Database Schema

### Users
- `clerkId`: Unique identifier from Clerk
- `name`: User's display name
- `email`: User's email address
- `image`: Profile picture URL
- `online`: Boolean indicating online status
- `lastSeen`: Timestamp of last activity

### Conversations
- `members`: Array of user IDs (2 users for direct messages)
- `lastMessage`: Preview of the most recent message
- `updatedAt`: Timestamp of last activity

### Messages
- `conversationId`: Reference to conversation
- `senderId`: User who sent the message
- `text`: Message content
- `createdAt`: Timestamp
- `isDeleted`: Soft delete flag
- `reactions`: Array of emoji reactions

### TypingIndicators
- `conversationId`: Reference to conversation
- `userId`: User who is typing
- `expiresAt`: Auto-expire timestamp

### LastRead
- `conversationId`: Reference to conversation
- `userId`: User who read
- `timestamp`: When they last read

## Key Features Implementation

### Real-time Updates
Uses Convex's built-in subscriptions. All queries automatically update when data changes.

### Online Status
- Heartbeat every 30 seconds keeps users online
- Cleanup on component unmount sets user offline
- Green dot indicator shows online status

### Typing Indicators
- Mutation called on input change
- Auto-expires after 3 seconds
- Shows "{User} is typing..." below messages

### Unread Counts
- Tracks last read timestamp per user per conversation
- Counts messages created after last read
- Resets when conversation is opened

### Smart Auto-scroll
- Auto-scrolls if user is near bottom (within 100px)
- Shows "New Messages" button if scrolled up
- Preserves scroll position when reading history

### Responsive Design
- Desktop: Sidebar + Chat window side-by-side
- Mobile: Toggle between list and chat views
- Back button returns to conversation list

## Best Practices

- **Type Safety**: Strict TypeScript with no `any` types
- **Real-time**: Leverages Convex subscriptions for instant updates
- **Performance**: Efficient queries with proper indexing
- **Security**: Protected routes with Clerk middleware
- **UX**: Loading states, empty states, error handling
- **Accessibility**: Semantic HTML, keyboard navigation
- **Code Quality**: Clean separation of concerns, reusable components

## Future Enhancements

The schema is designed to be extensible for:
- Group chats (already supports multiple members)
- Message reactions (schema ready)
- File attachments
- Message editing
- Read receipts
- Push notifications
- Voice/video calls

## License

MIT


## Developed by Niharika Ramishetty.
