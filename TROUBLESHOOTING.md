# Troubleshooting Guide

Common issues and their solutions for the real-time chat application.

## Table of Contents

1. [Installation Issues](#installation-issues)
2. [Convex Issues](#convex-issues)
3. [Clerk Authentication Issues](#clerk-authentication-issues)
4. [Real-Time Issues](#real-time-issues)
5. [UI/Display Issues](#uidisplay-issues)
6. [Build/Deployment Issues](#builddeployment-issues)
7. [Performance Issues](#performance-issues)

---

## Installation Issues

### npm install fails

**Symptoms:**
- Error messages during `npm install`
- Missing dependencies
- Version conflicts

**Solutions:**

1. **Clear npm cache:**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

2. **Use correct Node version:**
```bash
node --version  # Should be 18+
```

3. **Try yarn instead:**
```bash
npm install -g yarn
yarn install
```

### TypeScript errors after installation

**Symptoms:**
- Red squiggly lines everywhere
- "Cannot find module" errors
- Type errors in IDE

**Solutions:**

1. **Restart TypeScript server:**
   - VS Code: Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"

2. **Regenerate types:**
```bash
rm -rf .next
npm run dev
```

3. **Check tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## Convex Issues

### Cannot connect to Convex

**Symptoms:**
- "Failed to connect to Convex" error
- Infinite loading
- No data appears

**Solutions:**

1. **Check Convex dev server is running:**
```bash
# In a separate terminal
npx convex dev
```

2. **Verify environment variables:**
```bash
# Check .env.local
CONVEX_DEPLOYMENT=dev:...
NEXT_PUBLIC_CONVEX_URL=https://...convex.cloud
```

3. **Restart both servers:**
```bash
# Terminal 1
npx convex dev

# Terminal 2
npm run dev
```

4. **Check for typos in URL:**
   - Must start with `https://`
   - Must end with `.convex.cloud`
   - No trailing slashes

### Convex functions not found

**Symptoms:**
- "Function not found" errors
- `api.users.syncUser` is undefined
- Import errors

**Solutions:**

1. **Wait for Convex to generate types:**
   - Check terminal running `npx convex dev`
   - Look for "Functions deployed" message
   - Wait for "Watching for file changes..."

2. **Check convex/_generated folder exists:**
```bash
ls convex/_generated
# Should see: api.d.ts, api.js, dataModel.d.ts, server.d.ts, server.js
```

3. **Manually trigger regeneration:**
```bash
# Stop convex dev (Ctrl+C)
rm -rf convex/_generated
npx convex dev
```

### Schema changes not applying

**Symptoms:**
- Old schema still in use
- New fields not appearing
- Index errors

**Solutions:**

1. **Check Convex terminal for errors:**
   - Look for schema validation errors
   - Fix any syntax errors in `schema.ts`

2. **Clear and redeploy:**
```bash
npx convex dev --clear-all
```
   ⚠️ **Warning**: This deletes all data!

3. **Check schema syntax:**
```typescript
// Correct
defineTable({
  field: v.string(),
})

// Incorrect
defineTable({
  field: string,  // Missing v.
})
```

### Convex dashboard not opening

**Symptoms:**
- `npx convex dashboard` fails
- Browser doesn't open
- 404 error

**Solutions:**

1. **Check you're logged in:**
```bash
npx convex dev
# Should not ask for login
```

2. **Try direct URL:**
   - Go to https://dashboard.convex.dev
   - Select your project manually

3. **Check deployment name:**
```bash
cat .env.local | grep CONVEX_DEPLOYMENT
```

---

## Clerk Authentication Issues

### Redirects to wrong URL

**Symptoms:**
- Redirects to localhost in production
- Infinite redirect loop
- 404 after sign-in

**Solutions:**

1. **Check environment variables:**
```bash
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

2. **Update Clerk dashboard:**
   - Go to https://dashboard.clerk.com
   - Settings → Paths
   - Set Sign-in URL: `/sign-in`
   - Set Sign-up URL: `/sign-up`
   - Set After sign-in: `/`

3. **Check middleware:**
```typescript
// middleware.ts
export default authMiddleware({
  publicRoutes: ["/sign-in", "/sign-up"],
});
```

### User not syncing to Convex

**Symptoms:**
- Can sign in but see "Please sign in to continue"
- User not appearing in Convex dashboard
- `user` is null in `useCurrentUser`

**Solutions:**

1. **Check browser console:**
   - Look for errors in console
   - Check Network tab for failed requests

2. **Verify syncUser is called:**
```typescript
// hooks/use-current-user.ts
useEffect(() => {
  console.log("Clerk user:", clerkUser);
  console.log("Convex user:", convexUser);
  
  if (isLoaded && clerkUser && !convexUser) {
    console.log("Syncing user...");
    syncUser({...});
  }
}, [isLoaded, clerkUser, convexUser, syncUser]);
```

3. **Check Convex function:**
```bash
npx convex dashboard
# Go to Functions → users:syncUser
# Check for errors
```

4. **Manual sync:**
   - Sign out
   - Clear browser cookies
   - Sign in again

### Clerk keys not working

**Symptoms:**
- "Invalid publishable key" error
- Authentication fails immediately
- Clerk UI doesn't load

**Solutions:**

1. **Verify keys are correct:**
   - Go to Clerk dashboard
   - Copy keys again
   - Paste into `.env.local`

2. **Check key format:**
```bash
# Publishable key should start with:
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...

# Secret key should start with:
CLERK_SECRET_KEY=sk_test_...
```

3. **Restart dev server:**
```bash
# Stop server (Ctrl+C)
npm run dev
```

4. **Check for spaces:**
   - No spaces before or after `=`
   - No quotes around values
   - No trailing spaces

---

## Real-Time Issues

### Messages not appearing in real-time

**Symptoms:**
- Need to refresh to see new messages
- Delay in message delivery
- Messages appear out of order

**Solutions:**

1. **Check WebSocket connection:**
   - Open browser DevTools
   - Network tab → WS filter
   - Should see WebSocket connection to Convex

2. **Verify useQuery is used:**
```typescript
// Correct - real-time
const messages = useQuery(api.messages.getMessages, { conversationId });

// Incorrect - not real-time
const messages = await ctx.db.query("messages").collect();
```

3. **Check Convex dev server:**
   - Should be running
   - No errors in terminal
   - "Watching for file changes..."

4. **Test with two browsers:**
   - Open regular browser
   - Open incognito browser
   - Sign in with different accounts
   - Send message from one
   - Should appear instantly in other

### Typing indicators not working

**Symptoms:**
- "User is typing..." never appears
- Appears but doesn't disappear
- Shows for wrong user

**Solutions:**

1. **Check typing mutation is called:**
```typescript
// components/message-input.tsx
const handleTyping = () => {
  console.log("Setting typing indicator");
  setTyping({ conversationId, userId: currentUserId });
};
```

2. **Verify expiration logic:**
```typescript
// convex/typing.ts
const expiresAt = Date.now() + 3000; // 3 seconds
```

3. **Check query filters:**
```typescript
// Should exclude current user
const typingUsers = useQuery(api.typing.getTypingUsers, {
  conversationId,
  currentUserId, // Important!
});
```

### Online status not updating

**Symptoms:**
- Users always show offline
- Status doesn't change
- Green dot not appearing

**Solutions:**

1. **Check useOnlineStatus hook:**
```typescript
// app/(main)/page.tsx
useOnlineStatus(user?._id);
```

2. **Verify heartbeat interval:**
```typescript
// hooks/use-online-status.ts
const interval = setInterval(() => {
  console.log("Heartbeat");
  heartbeat({ userId });
}, 30000); // 30 seconds
```

3. **Check cleanup:**
```typescript
return () => {
  clearInterval(interval);
  console.log("Setting offline");
  updateStatus({ userId, online: false });
};
```

4. **Test manually:**
   - Open Convex dashboard
   - Go to users table
   - Check `online` field
   - Should be `true` when app is open

---

## UI/Display Issues

### Styles not loading

**Symptoms:**
- Unstyled HTML
- No colors or spacing
- Tailwind classes not working

**Solutions:**

1. **Check Tailwind is configured:**
```bash
# Should exist
ls tailwind.config.ts
ls postcss.config.js
```

2. **Verify globals.css is imported:**
```typescript
// app/layout.tsx
import "./globals.css";
```

3. **Restart dev server:**
```bash
npm run dev
```

4. **Clear Next.js cache:**
```bash
rm -rf .next
npm run dev
```

### Components not rendering

**Symptoms:**
- Blank screen
- "Component is not defined" error
- Import errors

**Solutions:**

1. **Check import paths:**
```typescript
// Correct
import { Button } from "@/components/ui/button";

// Incorrect
import { Button } from "components/ui/button";
```

2. **Verify file exists:**
```bash
ls components/ui/button.tsx
```

3. **Check for circular imports:**
   - Component A imports B
   - Component B imports A
   - Causes infinite loop

4. **Check browser console:**
   - Look for error messages
   - Check stack trace

### Avatar images not loading

**Symptoms:**
- Broken image icons
- Fallback always shows
- Images don't load

**Solutions:**

1. **Check image URL:**
```typescript
console.log("Image URL:", user.image);
// Should be valid URL
```

2. **Verify Clerk provides image:**
   - Check Clerk dashboard
   - User should have profile picture
   - URL should be accessible

3. **Test URL directly:**
   - Copy image URL
   - Paste in browser
   - Should load image

4. **Check Avatar component:**
```typescript
<Avatar>
  <AvatarImage src={user.image} />
  <AvatarFallback>
    {user.name.charAt(0).toUpperCase()}
  </AvatarFallback>
</Avatar>
```

### Mobile layout broken

**Symptoms:**
- Sidebar and chat both visible on mobile
- Can't navigate back
- UI overlaps

**Solutions:**

1. **Check responsive classes:**
```typescript
// Should hide on mobile when chat is open
className={cn(
  "w-full md:w-80",
  isMobileView && "hidden md:block"
)}
```

2. **Verify state management:**
```typescript
const [isMobileView, setIsMobileView] = useState(false);

// Set to true when conversation selected
setIsMobileView(true);

// Set to false on back button
setIsMobileView(false);
```

3. **Test responsive breakpoints:**
   - Resize browser window
   - Should switch at 768px
   - Use browser DevTools device mode

---

## Build/Deployment Issues

### Build fails

**Symptoms:**
- `npm run build` fails
- TypeScript errors
- Module not found errors

**Solutions:**

1. **Fix TypeScript errors:**
```bash
npm run build
# Read error messages
# Fix each error
```

2. **Check all imports:**
```bash
# Find unused imports
npm run lint
```

3. **Verify environment variables:**
```bash
# Production needs these
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_CONVEX_URL
CONVEX_DEPLOYMENT
```

4. **Test build locally:**
```bash
npm run build
npm start
# Visit http://localhost:3000
```

### Vercel deployment fails

**Symptoms:**
- Build succeeds locally but fails on Vercel
- Environment variable errors
- Function timeout errors

**Solutions:**

1. **Check Vercel logs:**
   - Go to Vercel dashboard
   - Click on failed deployment
   - Read build logs

2. **Verify environment variables:**
   - Go to Project Settings
   - Environment Variables
   - Check all are set
   - No typos

3. **Check Node version:**
```json
// package.json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

4. **Redeploy:**
   - Push a new commit
   - Or trigger manual redeploy

### Production app not working

**Symptoms:**
- Builds successfully but doesn't work
- Authentication fails
- Can't connect to Convex

**Solutions:**

1. **Check Clerk allowed origins:**
   - Go to Clerk dashboard
   - Add Vercel URL
   - Format: `https://your-app.vercel.app`

2. **Verify Convex deployment:**
```bash
npx convex deploy
# Use production URL in Vercel env vars
```

3. **Check environment variables:**
   - Must use production values
   - Not development values
   - All variables set

4. **Test in incognito:**
   - Clear cache
   - Open incognito window
   - Test all features

---

## Performance Issues

### App is slow

**Symptoms:**
- Slow page loads
- Laggy UI
- Delayed updates

**Solutions:**

1. **Check network tab:**
   - Open DevTools
   - Network tab
   - Look for slow requests
   - Check bundle size

2. **Optimize queries:**
```typescript
// Bad - fetches all messages
const messages = await ctx.db.query("messages").collect();

// Good - uses index
const messages = await ctx.db
  .query("messages")
  .withIndex("by_conversation", (q) => 
    q.eq("conversationId", conversationId)
  )
  .collect();
```

3. **Check for unnecessary re-renders:**
```typescript
// Use React DevTools Profiler
// Look for components rendering too often
```

4. **Optimize images:**
   - Use Next.js Image component
   - Compress images
   - Use appropriate sizes

### Messages load slowly

**Symptoms:**
- Long delay before messages appear
- Spinner shows for long time
- Timeout errors

**Solutions:**

1. **Check message count:**
```bash
npx convex dashboard
# Go to messages table
# Check row count
```

2. **Add pagination:**
```typescript
// Limit messages loaded
.order("desc")
.take(50)
```

3. **Optimize query:**
```typescript
// Use proper index
.withIndex("by_conversation", (q) => 
  q.eq("conversationId", conversationId)
)
```

4. **Check network speed:**
   - Test on different network
   - Check Convex region
   - Consider CDN

### High memory usage

**Symptoms:**
- Browser tab crashes
- "Out of memory" errors
- Computer slows down

**Solutions:**

1. **Check for memory leaks:**
```typescript
// Clean up intervals
useEffect(() => {
  const interval = setInterval(...);
  
  return () => {
    clearInterval(interval); // Important!
  };
}, []);
```

2. **Limit data loaded:**
```typescript
// Don't load all messages at once
// Use pagination or virtual scrolling
```

3. **Check browser extensions:**
   - Disable extensions
   - Test in incognito
   - Check if issue persists

---

## Getting More Help

### Check Logs

**Browser Console:**
```javascript
// Open DevTools (F12)
// Console tab
// Look for errors (red text)
```

**Convex Logs:**
```bash
# Terminal running npx convex dev
# Look for error messages
# Check function execution logs
```

**Vercel Logs:**
```bash
# Vercel dashboard
# Click deployment
# View function logs
# Check build logs
```

### Debug Mode

**Enable verbose logging:**
```typescript
// Add to components
console.log("State:", { user, messages, conversations });

// Add to Convex functions
console.log("Function called:", args);
```

### Resources

- **Convex Discord**: https://convex.dev/community
- **Clerk Discord**: https://clerk.com/discord
- **Next.js Discussions**: https://github.com/vercel/next.js/discussions
- **Stack Overflow**: Tag questions with `convex`, `clerk`, `nextjs`

### Report Issues

If you find a bug:

1. **Check if it's already reported**
2. **Create minimal reproduction**
3. **Include:**
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots/videos
   - Browser/OS info
   - Error messages
   - Console logs

### Common Error Messages

**"Cannot read property 'map' of undefined"**
- Data not loaded yet
- Add loading check: `if (!data) return null;`

**"Maximum update depth exceeded"**
- Infinite loop in useEffect
- Check dependencies array

**"Hydration failed"**
- Server/client mismatch
- Check for browser-only code
- Use `"use client"` directive

**"Failed to fetch"**
- Network error
- Check Convex URL
- Verify server is running

**"Invalid hook call"**
- Hook called outside component
- Check hook usage rules
- Verify component structure

---

## Prevention Tips

### Development Best Practices

1. **Always check console for errors**
2. **Test in multiple browsers**
3. **Use TypeScript strictly**
4. **Write descriptive commit messages**
5. **Test before deploying**

### Code Quality

1. **Use ESLint**
2. **Format with Prettier**
3. **Write comments for complex logic**
4. **Keep components small**
5. **Reuse code with hooks**

### Testing

1. **Test with multiple users**
2. **Test on mobile devices**
3. **Test slow networks**
4. **Test edge cases**
5. **Test error states**

### Monitoring

1. **Check Convex dashboard regularly**
2. **Monitor Vercel analytics**
3. **Review Clerk logs**
4. **Track user feedback**
5. **Monitor performance metrics**

---

## Still Having Issues?

If you've tried everything and still have problems:

1. **Create a minimal reproduction**
2. **Check documentation again**
3. **Search existing issues**
4. **Ask in community forums**
5. **Contact support if needed**

Remember: Most issues are caused by:
- Missing environment variables
- Typos in configuration
- Cached data
- Not restarting servers

When in doubt, restart everything! 🔄
