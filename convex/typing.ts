import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Set typing indicator
export const setTyping = mutation({
  args: {
    conversationId: v.id("conversations"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const expiresAt = Date.now() + 3000; // 3 seconds

    const existing = await ctx.db
      .query("typingIndicators")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
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

// Get typing users for a conversation
export const getTypingUsers = query({
  args: {
    conversationId: v.id("conversations"),
    currentUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const indicators = await ctx.db
      .query("typingIndicators")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .collect();

    const activeIndicators = indicators.filter(
      (ind) => ind.expiresAt > now && ind.userId !== args.currentUserId
    );

    const users = await Promise.all(
      activeIndicators.map((ind) => ctx.db.get(ind.userId))
    );

    return users.filter((u) => u !== null);
  },
});

// Clean up expired typing indicators (called periodically)
export const cleanupExpiredTyping = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const expired = await ctx.db
      .query("typingIndicators")
      .withIndex("by_expires", (q) => q.lt("expiresAt", now))
      .collect();

    await Promise.all(expired.map((ind) => ctx.db.delete(ind._id)));
  },
});
