# Features Documentation

Complete guide to all features in the real-time chat application.

## Table of Contents

1. [Authentication](#authentication)
2. [User Management](#user-management)
3. [Real-Time Messaging](#real-time-messaging)
4. [Online/Offline Status](#onlineoffline-status)
5. [Typing Indicators](#typing-indicators)
6. [Unread Message Counts](#unread-message-counts)
7. [Smart Auto-Scroll](#smart-auto-scroll)
8. [Search Functionality](#search-functionality)
9. [Responsive Design](#responsive-design)
10. [Message Timestamps](#message-timestamps)

---

## Authentication

### Overview
Secure authentication powered by Clerk with support for multiple sign-in methods.

### Features

#### Email/Password Authentication
- Users can sign up with email and password
- Password strength requirements enforced
- Email verification available

#### Social Login
- Google OAuth
- GitHub OAuth
- Other providers can be enabled in Clerk dashboard

#### Protected Routes
- Unauthenticated users redirected to sign-in
- Middleware protects all routes except auth pages
- Automatic redirect after successful login

### Implementation Details

**Middleware** (`middleware.ts`):
```typescript
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/sign-in", "/sign-up"],
});
```

**User Sync** (`hooks/use-current-user.ts`):
- Automatically syncs Clerk user to Convex database
- Creates user record on first login
- Updates user info on subsequent logins

### User Experience

1. User visits app
2. Redirected to `/sign-in` if not authenticated
3. Signs in with email/password or social provider
4. Synced to Convex database
5. Redirected to main chat interface

---

## User Management

### Overview
Comprehensive user management with profile information and status tracking.

### Database Schema

```typescript
users: {
  clerkId: string,      // Unique Clerk identifier
  name: string,         // Display name
  email: string,        // Email address
  image?: string,       // Profile picture URL
  online: boolean,      // Current online status
  lastSeen: number,     // Last activity timestamp
}
```

### Features

#### User Profile Display
- Avatar with fallback to initials
- Display name
- Online/offline status indicator
- Last seen timestamp

#### User List
- Shows all users except current user
- Real-time search filtering
- Online status indicators
- Click to start conversation

#### User Search
- Real-time filtering by name
- Case-insensitive search
- Instant results
- Empty state when no results

### Implementation

**Get All Users** (`convex/users.ts`):
```typescript
export const getAllUsers = query({
  args: { currentUserId: v.id("users") },
  handler: async (ctx, args) => {
    const users = await ctx.db.query("users").collect();
    return users.filter((user) => user._id !== args.currentUserId);
  },
});
```

**User List Component** (`components/user-list.tsx`):
- Displays filtered user list
- Shows online status with green dot
- Handles user selection
- Responsive design

---

## Real-Time Messaging

### Overview
Instant message delivery using Convex's real-time subscriptions.

### Database Schema

```typescript
messages: {
  conversationId: Id<"conversations">,
  senderId: Id<"users">,
  text: string,
  createdAt: number,
  isDeleted: boolean,
  reactions: Array<{ userId, emoji }>,
}
```

### Features

#### Instant Delivery
- Messages appear instantly for all participants
- No polling or manual refresh needed
- WebSocket-based real-time updates

#### Message Display
- Sender avatar and name
- Message text with word wrapping
- Timestamp
- Different styling for own vs. other messages

#### Message Composition
- Text input field
- Send button (disabled when empty)
- Enter key to send
- Auto-clear after sending

#### Conversation Management
- Automatic conversation creation
- Last message preview
- Sorted by most recent activity
- Conversation list updates in real-time

### Implementation

**Send Message** (`convex/messages.ts`):
```typescript
export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: args.senderId,
      text: args.text,
      createdAt: Date.now(),
      isDeleted: false,
      reactions: [],
    });

    // Update conversation
    await ctx.db.patch(args.conversationId, {
      lastMessage: args.text,
      updatedAt: Date.now(),
    });

    return messageId;
  },
});
```

**Real-Time Updates**:
- Uses Convex `useQuery` hook
- Automatically subscribes to changes
- Re-renders when data updates
- No manual subscription management

---

## Online/Offline Status

### Overview
Real-time presence tracking showing which users are currently active.

### Features

#### Visual Indicators
- Green dot = online
- No dot = offline
- Shown on avatars throughout the app

#### Automatic Status Management
- Set online when app opens
- Heartbeat every 30 seconds
- Set offline when app closes
- Handles browser tab close/refresh

#### Real-Time Updates
- Status changes appear instantly
- All users see updated status
- No delay or polling

### Implementation

**Online Status Hook** (`hooks/use-online-status.ts`):
```typescript
export function useOnlineStatus(userId: Id<"users"> | undefined) {
  const updateStatus = useMutation(api.users.updateOnlineStatus);
  const heartbeat = useMutation(api.users.heartbeat);

  useEffect(() => {
    if (!userId) return;

    // Set online on mount
    updateStatus({ userId, online: true });

    // Heartbeat every 30 seconds
    const interval = setInterval(() => {
      heartbeat({ userId });
    }, 30000);

    // Set offline on unmount
    return () => {
      clearInterval(interval);
      updateStatus({ userId, online: false });
    };
  }, [userId, updateStatus, heartbeat]);
}
```

**Heartbeat Function** (`convex/users.ts`):
```typescript
export const heartbeat = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      online: true,
      lastSeen: Date.now(),
    });
  },
});
```

### User Experience

1. User opens app → status set to online
2. Every 30 seconds → heartbeat keeps status online
3. User closes app → status set to offline
4. Other users see status change instantly

---

## Typing Indicators

### Overview
Show when someone is typing a message in real-time.

### Database Schema

```typescript
typingIndicators: {
  conversationId: Id<"conversations">,
  userId: Id<"users">,
  expiresAt: number,
}
```

### Features

#### Real-Time Display
- Shows "{User} is typing..." below messages
- Appears as user types
- Disappears after 2 seconds of inactivity
- Auto-expires after 3 seconds

#### Smart Behavior
- Only shows for other users (not yourself)
- Updates on every keystroke
- Cleans up automatically
- No manual management needed

### Implementation

**Set Typing** (`convex/typing.ts`):
```typescript
export const setTyping = mutation({
  args: {
    conversationId: v.id("conversations"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const expiresAt = Date.now() + 3000; // 3 seconds

    const existing = await ctx.db
      .query("typingIndicators")
      .withIndex("by_conversation", (q) => 
        q.eq("conversationId", args.conversationId)
      )
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { expiresAt });
    } else {
      await ctx.db.insert("typingIndicators", {
        conversationId: args.conversationId,
        userId: args.userId,
        expiresAt,
      });
    }
  },
});
```

**Message Input** (`components/message-input.tsx`):
```typescript
const handleTyping = () => {
  setTyping({ conversationId, userId: currentUserId });
  
  if (typingTimeoutRef.current) {
    clearTimeout(typingTimeoutRef.current);
  }
  
  typingTimeoutRef.current = setTimeout(() => {
    // Typing indicator will auto-expire after 3 seconds
  }, 2000);
};
```

### User Experience

1. User A starts typing
2. User B sees "User A is typing..."
3. User A stops typing
4. Indicator disappears after 2 seconds
5. Or auto-expires after 3 seconds

---

## Unread Message Counts

### Overview
Track and display unread messages per conversation.

### Database Schema

```typescript
lastRead: {
  conversationId: Id<"conversations">,
  userId: Id<"users">,
  timestamp: number,
}
```

### Features

#### Badge Display
- Shows count of unread messages
- Appears on conversation list item
- Red badge with white text
- Updates in real-time

#### Smart Counting
- Counts messages after last read timestamp
- Only counts messages from other users
- Resets when conversation is opened
- Persists across sessions

#### Automatic Reset
- Marks as read when conversation opens
- Updates timestamp to current time
- Badge disappears immediately

### Implementation

**Mark as Read** (`convex/messages.ts`):
```typescript
export const markAsRead = mutation({
  args: {
    conversationId: v.id("conversations"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("lastRead")
      .withIndex("by_conversation_user", (q) =>
        q.eq("conversationId", args.conversationId)
         .eq("userId", args.userId)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        timestamp: Date.now(),
      });
    } else {
      await ctx.db.insert("lastRead", {
        conversationId: args.conversationId,
        userId: args.userId,
        timestamp: Date.now(),
      });
    }
  },
});
```

**Unread Count Calculation** (`convex/conversations.ts`):
```typescript
const lastReadRecord = await ctx.db
  .query("lastRead")
  .withIndex("by_conversation_user", (q) =>
    q.eq("conversationId", conv._id).eq("userId", args.userId)
  )
  .unique();

const lastReadTimestamp = lastReadRecord?.timestamp || 0;

const messages = await ctx.db
  .query("messages")
  .withIndex("by_conversation", (q) => 
    q.eq("conversationId", conv._id)
  )
  .collect();

const unreadCount = messages.filter(
  (msg) =>
    msg.createdAt > lastReadTimestamp && 
    msg.senderId !== args.userId
).length;
```

### User Experience

1. User A sends message to User B
2. User B sees badge with "1" on conversation
3. User B opens conversation
4. Badge disappears
5. Last read timestamp updated

---

## Smart Auto-Scroll

### Overview
Intelligent scrolling behavior that preserves user intent.

### Features

#### Auto-Scroll When Near Bottom
- Automatically scrolls to new messages
- Only when user is near bottom (within 100px)
- Smooth scrolling animation
- Preserves reading position

#### Manual Scroll Control
- User can scroll up to read history
- New messages don't force scroll
- Shows "New Messages" button instead
- Click button to scroll to bottom

#### Initial Load
- Scrolls to bottom on first load
- Shows most recent messages
- Smooth animation

### Implementation

**Message List** (`components/message-list.tsx`):
```typescript
const [showScrollButton, setShowScrollButton] = useState(false);
const [isNearBottom, setIsNearBottom] = useState(true);

const handleScroll = () => {
  if (!scrollRef.current) return;
  
  const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
  const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
  
  const nearBottom = distanceFromBottom < 100;
  setIsNearBottom(nearBottom);
  setShowScrollButton(!nearBottom && messages && messages.length > 0);
};

useEffect(() => {
  if (isNearBottom) {
    scrollToBottom();
  }
}, [messages, isNearBottom]);
```

**Scroll Button**:
```typescript
{showScrollButton && (
  <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
    <Button
      size="sm"
      onClick={scrollToBottom}
      className="rounded-full shadow-lg"
    >
      <ArrowDown className="mr-2 h-4 w-4" />
      New Messages
    </Button>
  </div>
)}
```

### User Experience

**Scenario 1: Reading Latest Messages**
1. User is at bottom of chat
2. New message arrives
3. Chat auto-scrolls to show new message

**Scenario 2: Reading History**
1. User scrolls up to read old messages
2. New message arrives
3. "New Messages" button appears
4. User clicks button to see new message

---

## Search Functionality

### Overview
Real-time user search with instant filtering.

### Features

#### Instant Results
- Filters as you type
- No search button needed
- Case-insensitive matching
- Matches anywhere in name

#### Visual Feedback
- Search icon in input field
- Clear indication of search state
- Empty state when no results
- Result count visible

### Implementation

**User List** (`components/user-list.tsx`):
```typescript
const [search, setSearch] = useState("");
const users = useQuery(api.users.getAllUsers, { currentUserId });

const filteredUsers = users?.filter((user) =>
  user.name.toLowerCase().includes(search.toLowerCase())
);
```

**Search Input**:
```typescript
<div className="relative">
  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
  <Input
    placeholder="Search users..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="pl-9"
  />
</div>
```

### User Experience

1. User clicks "Users" tab
2. Types in search box
3. Results filter instantly
4. Click user to start chat

---

## Responsive Design

### Overview
Fully responsive interface that adapts to all screen sizes.

### Breakpoints

- **Mobile**: < 768px
- **Desktop**: ≥ 768px

### Mobile Layout

#### Conversation List View
- Full-width conversation list
- Search bar at top
- Tap conversation to open chat
- No chat window visible

#### Chat View
- Full-width chat window
- Back button to return to list
- Message input at bottom
- Optimized for touch

### Desktop Layout

#### Split View
- Sidebar (320px) on left
- Chat window fills remaining space
- Both visible simultaneously
- No back button needed

### Implementation

**Responsive Classes** (`app/(main)/page.tsx`):
```typescript
// Sidebar
<div className={cn(
  "w-full border-r bg-white md:w-80",
  isMobileView && "hidden md:block"
)}>

// Chat Window
<div className={cn(
  "flex-1 bg-gray-50",
  !isMobileView && "hidden md:flex"
)}>

// Back Button
<Button
  variant="ghost"
  size="icon"
  onClick={onBack}
  className="md:hidden"
>
  <ArrowLeft className="h-5 w-5" />
</Button>
```

### User Experience

**Mobile**:
1. See conversation list
2. Tap conversation
3. See full-screen chat
4. Tap back to return to list

**Desktop**:
1. See conversation list and chat side-by-side
2. Click conversation to change chat
3. No navigation needed

---

## Message Timestamps

### Overview
Smart timestamp formatting that shows relevant time information.

### Features

#### Today's Messages
- Shows time only
- Format: "2:34 PM"
- 12-hour format with AM/PM

#### This Year's Messages
- Shows date and time
- Format: "Feb 15, 2:34 PM"
- Short month name

#### Previous Years
- Shows full date with year
- Format: "Feb 15, 2024, 2:34 PM"
- Includes year for context

#### Conversation Preview
- Relative time for recent messages
- "Just now", "5m ago", "2h ago"
- Switches to date after 7 days

### Implementation

**Message Time** (`lib/utils.ts`):
```typescript
export function formatMessageTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();
  
  const isSameYear = date.getFullYear() === now.getFullYear();
  
  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  
  if (isToday) {
    return timeStr;
  }
  
  const dateStr = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: isSameYear ? undefined : "numeric",
  });
  
  return `${dateStr}, ${timeStr}`;
}
```

**Conversation Time** (`lib/utils.ts`):
```typescript
export function formatConversationTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
```

### User Experience

**In Chat**:
- Today: "2:34 PM"
- Yesterday: "Feb 20, 2:34 PM"
- Last year: "Dec 25, 2025, 2:34 PM"

**In Conversation List**:
- Just sent: "Just now"
- 5 minutes ago: "5m ago"
- 2 hours ago: "2h ago"
- 3 days ago: "3d ago"
- Last week: "Feb 14"

---

## Future Features

The application is designed to be extensible. Here are features that can be easily added:

### Group Chats
- Schema already supports multiple members
- Add group creation UI
- Implement group management

### File Uploads
- Add file upload to messages
- Store files in cloud storage
- Display images inline

### Message Reactions
- Schema already includes reactions array
- Add emoji picker
- Display reactions on messages

### Message Editing
- Add edit functionality
- Track edit history
- Show "edited" indicator

### Read Receipts
- Track who read each message
- Show checkmarks
- Display read status

### Push Notifications
- Notify users of new messages
- Work even when app is closed
- Customizable notification settings

### Voice/Video Calls
- Integrate WebRTC
- Add call buttons
- Handle call state

### User Profiles
- Extended user information
- Profile editing
- Status messages

### Message Search
- Search within conversations
- Full-text search
- Filter by date/user

### Dark Mode
- Theme toggle
- Persist preference
- System preference detection
