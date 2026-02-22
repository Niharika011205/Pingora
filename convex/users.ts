import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Sync user from Clerk to Convex database
export const syncUser = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(existingUser._id, {
        name: args.name,
        email: args.email,
        image: args.image,
        online: true,
        lastSeen: Date.now(),
      });
      return existingUser._id;
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      clerkId: args.clerkId,
      name: args.name,
      email: args.email,
      image: args.image,
      online: true,
      lastSeen: Date.now(),
    });

    return userId;
  },
});

// Get current user by Clerk ID
export const getCurrentUser = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();
    return user;
  },
});

// Get all users except current user
export const getAllUsers = query({
  args: { currentUserId: v.id("users") },
  handler: async (ctx, args) => {
    const users = await ctx.db.query("users").collect();
    return users.filter((user) => user._id !== args.currentUserId && user.clerkId);
  },
});

// Update user online status
export const updateOnlineStatus = mutation({
  args: {
    userId: v.id("users"),
    online: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      online: args.online,
      lastSeen: Date.now(),
    });
  },
});

// Heartbeat to keep user online
export const heartbeat = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      online: true,
      lastSeen: Date.now(),
    });
  },
});

// Delete user from Convex database
export const deleteUser = mutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (user) {
      // Delete all messages sent by this user
      const userMessages = await ctx.db
        .query("messages")
        .withIndex("by_sender", (q) => q.eq("senderId", user._id))
        .collect();

      for (const message of userMessages) {
        await ctx.db.delete(message._id);
      }

      // Delete all conversations where this user is a member
      const conversations = await ctx.db.query("conversations").collect();
      for (const conv of conversations) {
        if (conv.members.includes(user._id)) {
          // Delete all messages in the conversation
          const convMessages = await ctx.db
            .query("messages")
            .withIndex("by_conversation", (q) => q.eq("conversationId", conv._id))
            .collect();

          for (const msg of convMessages) {
            await ctx.db.delete(msg._id);
          }

          await ctx.db.delete(conv._id);
        }
      }

      // Delete user's last read records
      const lastReads = await ctx.db
        .query("lastRead")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .collect();

      for (const lastRead of lastReads) {
        await ctx.db.delete(lastRead._id);
      }

      // Delete user's typing indicators
      const typingIndicators = await ctx.db
        .query("typingIndicators")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .collect();

      for (const typing of typingIndicators) {
        await ctx.db.delete(typing._id);
      }

      await ctx.db.delete(user._id);
    }
  },
});
