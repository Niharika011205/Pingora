# Deployment Guide

This guide walks you through deploying your real-time chat application to production.

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- Clerk account (free tier works)
- Convex account (free tier works)

## Step 1: Prepare Your Code

1. **Initialize Git repository** (if not already done):
```bash
git init
git add .
git commit -m "Initial commit: Real-time chat app"
```

2. **Push to GitHub**:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Convex Backend

1. **Deploy to production**:
```bash
npx convex deploy
```

2. **Save the output**:
   - You'll receive a production deployment name (e.g., `happy-animal-123`)
   - You'll receive a production URL (e.g., `https://happy-animal-123.convex.cloud`)
   - Save these for the next step

3. **Verify deployment**:
```bash
npx convex dashboard
```
   - Check that all tables are created
   - Verify functions are deployed

## Step 3: Configure Clerk for Production

1. **Go to Clerk Dashboard** (https://dashboard.clerk.com)

2. **Update allowed origins**:
   - Go to your application settings
   - Add your Vercel domain (you'll get this in Step 4)
   - Format: `https://your-app.vercel.app`

3. **Update redirect URLs**:
   - Sign-in redirect: `https://your-app.vercel.app`
   - Sign-up redirect: `https://your-app.vercel.app`
   - Sign-out redirect: `https://your-app.vercel.app/sign-in`

4. **Keep your API keys handy**:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

## Step 4: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. **Go to Vercel** (https://vercel.com)

2. **Import your GitHub repository**:
   - Click "Add New Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure environment variables**:
   Click "Environment Variables" and add:

   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   CONVEX_DEPLOYMENT=happy-animal-123
   NEXT_PUBLIC_CONVEX_URL=https://happy-animal-123.convex.cloud
   ```

4. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - You'll get a URL like `https://your-app.vercel.app`

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy**:
```bash
vercel
```

4. **Add environment variables**:
```bash
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
vercel env add CLERK_SECRET_KEY
vercel env add NEXT_PUBLIC_CLERK_SIGN_IN_URL
vercel env add NEXT_PUBLIC_CLERK_SIGN_UP_URL
vercel env add CONVEX_DEPLOYMENT
vercel env add NEXT_PUBLIC_CONVEX_URL
```

5. **Deploy to production**:
```bash
vercel --prod
```

## Step 5: Update Clerk with Vercel URL

1. **Go back to Clerk Dashboard**

2. **Update allowed origins**:
   - Add your Vercel URL: `https://your-app.vercel.app`

3. **Update redirect URLs**:
   - Update all URLs to use your Vercel domain

## Step 6: Test Your Deployment

1. **Visit your Vercel URL**

2. **Test authentication**:
   - Sign up with a new account
   - Sign in with existing account
   - Test social login (if enabled)

3. **Test chat features**:
   - Open app in two different browsers
   - Sign in with different accounts
   - Send messages
   - Verify real-time updates
   - Check online status
   - Test typing indicators
   - Verify unread counts

4. **Test mobile responsiveness**:
   - Open on mobile device
   - Test navigation
   - Verify UI adapts correctly

## Step 7: Configure Custom Domain (Optional)

1. **In Vercel Dashboard**:
   - Go to your project settings
   - Click "Domains"
   - Add your custom domain

2. **Update DNS records**:
   - Follow Vercel's instructions
   - Add CNAME or A record

3. **Update Clerk**:
   - Add custom domain to allowed origins
   - Update redirect URLs

## Monitoring and Maintenance

### Monitor Convex

```bash
npx convex dashboard
```

- View function logs
- Monitor database usage
- Check for errors

### Monitor Vercel

- Go to Vercel Dashboard
- View deployment logs
- Check analytics
- Monitor performance

### Monitor Clerk

- Go to Clerk Dashboard
- View user activity
- Check authentication logs
- Monitor sign-ups

## Troubleshooting

### Build Fails on Vercel

**Issue**: TypeScript errors during build

**Solution**:
1. Run `npm run build` locally
2. Fix any TypeScript errors
3. Commit and push changes
4. Vercel will auto-deploy

### Authentication Not Working

**Issue**: Redirects to wrong URL or shows errors

**Solution**:
1. Verify Clerk environment variables are correct
2. Check allowed origins in Clerk dashboard
3. Ensure redirect URLs match your domain
4. Clear browser cache and cookies

### Real-time Updates Not Working

**Issue**: Messages don't appear in real-time

**Solution**:
1. Verify `NEXT_PUBLIC_CONVEX_URL` is correct
2. Check Convex deployment status
3. Open browser console for errors
4. Verify WebSocket connection is established

### Users Not Syncing

**Issue**: Users can't see each other

**Solution**:
1. Check Convex dashboard for user records
2. Verify `syncUser` mutation is being called
3. Check browser console for errors
4. Ensure Clerk user data is accessible

## Updating Your Deployment

### Update Code

1. **Make changes locally**
2. **Test locally**:
```bash
npm run dev
```

3. **Commit and push**:
```bash
git add .
git commit -m "Your changes"
git push
```

4. **Vercel auto-deploys** from main branch

### Update Convex Schema

1. **Modify `convex/schema.ts`**

2. **Deploy changes**:
```bash
npx convex deploy
```

3. **Convex handles migrations automatically**

### Update Environment Variables

1. **In Vercel Dashboard**:
   - Go to project settings
   - Click "Environment Variables"
   - Update values
   - Redeploy

2. **Or via CLI**:
```bash
vercel env rm VARIABLE_NAME
vercel env add VARIABLE_NAME
vercel --prod
```

## Performance Optimization

### Enable Vercel Analytics

1. Go to project settings
2. Enable Analytics
3. Monitor performance metrics

### Optimize Images

- Use Next.js Image component
- Serve images from CDN
- Compress profile pictures

### Database Indexing

- Convex automatically indexes
- Review query performance in dashboard
- Add custom indexes if needed

### Caching

- Vercel automatically caches static assets
- Configure cache headers if needed
- Use ISR for dynamic content

## Security Best Practices

1. **Environment Variables**:
   - Never commit `.env.local`
   - Use Vercel's environment variables
   - Rotate secrets regularly

2. **Clerk Security**:
   - Enable 2FA for admin accounts
   - Review security settings
   - Monitor suspicious activity

3. **Convex Security**:
   - Review function permissions
   - Implement proper authentication checks
   - Monitor database access

4. **HTTPS**:
   - Vercel provides HTTPS automatically
   - Enforce HTTPS in Clerk settings
   - Use secure cookies

## Scaling Considerations

### Convex Limits (Free Tier)

- 1M function calls/month
- 1GB database storage
- Upgrade to Pro for more

### Vercel Limits (Free Tier)

- 100GB bandwidth/month
- Unlimited deployments
- Upgrade to Pro for more

### Clerk Limits (Free Tier)

- 10,000 monthly active users
- Upgrade to Pro for more

## Backup and Recovery

### Convex Backups

- Convex automatically backs up data
- Export data via dashboard
- Use Convex CLI for backups

### Code Backups

- GitHub stores your code
- Tag releases for easy rollback
- Use branches for features

## Support Resources

- **Convex Docs**: https://docs.convex.dev
- **Clerk Docs**: https://clerk.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs

## Cost Estimates

### Free Tier (Suitable for MVP)

- Convex: Free
- Clerk: Free (up to 10k MAU)
- Vercel: Free
- **Total: $0/month**

### Production (Small Scale)

- Convex Pro: $25/month
- Clerk Pro: $25/month
- Vercel Pro: $20/month
- **Total: $70/month**

### Production (Medium Scale)

- Convex Pro: $25/month
- Clerk Pro: $99/month (50k MAU)
- Vercel Pro: $20/month
- **Total: $144/month**

## Next Steps

After deployment, consider:

1. **Add features**:
   - Group chats
   - File uploads
   - Voice/video calls
   - Push notifications

2. **Improve UX**:
   - Add loading skeletons
   - Implement error boundaries
   - Add toast notifications
   - Improve mobile experience

3. **Analytics**:
   - Track user engagement
   - Monitor message volume
   - Analyze user behavior

4. **Marketing**:
   - Create landing page
   - Add SEO metadata
   - Share on social media
   - Gather user feedback
