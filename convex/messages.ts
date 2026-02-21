import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Send a message
export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    text: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: args.senderId,
      text: args.text,
      imageUrl: args.imageUrl,
      createdAt: Date.now(),
      deliveredAt: Date.now(),
      isDeleted: false,
      reactions: [],
      readBy: [],
    });

    // Update conversation's lastMessage and updatedAt
    await ctx.db.patch(args.conversationId, {
      lastMessage: args.text,
      updatedAt: Date.now(),
    });

    return messageId;
  },
});

// Edit a message
export const editMessage = mutation({
  args: {
    messageId: v.id("messages"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.messageId);
    if (!message) return;

    // Only allow editing within 5 minutes
    const fiveMinutes = 5 * 60 * 1000;
    if (Date.now() - message.createdAt > fiveMinutes) {
      throw new Error("Cannot edit message after 5 minutes");
    }

    await ctx.db.patch(args.messageId, {
      text: args.text,
      editedAt: Date.now(),
    });
  },
});

// Mark message as read
export const markMessageAsRead = mutation({
  args: {
    messageId: v.id("messages"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.messageId);
    if (!message) return;

    const readBy = message.readBy || [];
    const alreadyRead = readBy.some((r) => r.userId === args.userId);

    if (!alreadyRead) {
      await ctx.db.patch(args.messageId, {
        readBy: [...readBy, { userId: args.userId, readAt: Date.now() }],
      });
    }
  },
});

// Get messages for a conversation
export const getMessages = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .collect();

    // Enrich with sender details
    const enriched = await Promise.all(
      messages.map(async (msg) => {
        const sender = await ctx.db.get(msg.senderId);
        return {
          ...msg,
          sender,
        };
      })
    );

    return enriched;
  },
});

// Search messages in a conversation
export const searchMessages = query({
  args: {
    conversationId: v.id("conversations"),
    searchTerm: v.string(),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .collect();

    const searchLower = args.searchTerm.toLowerCase();
    const filtered = messages.filter((msg) =>
      msg.text.toLowerCase().includes(searchLower)
    );

    // Enrich with sender details
    const enriched = await Promise.all(
      filtered.map(async (msg) => {
        const sender = await ctx.db.get(msg.senderId);
        return {
          ...msg,
          sender,
        };
      })
    );

    return enriched;
  },
});

// Mark conversation as read
export const markAsRead = mutation({
  args: {
    conversationId: v.id("conversations"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("lastRead")
      .withIndex("by_conversation_user", (q) =>
        q.eq("conversationId", args.conversationId).eq("userId", args.userId)
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

    // Mark all messages as read
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .collect();

    for (const message of messages) {
      if (message.senderId !== args.userId) {
        const readBy = message.readBy || [];
        const alreadyRead = readBy.some((r) => r.userId === args.userId);
        
        if (!alreadyRead) {
          await ctx.db.patch(message._id, {
            readBy: [...readBy, { userId: args.userId, readAt: Date.now() }],
          });
        }
      }
    }
  },
});

// Delete a message
export const deleteMessage = mutation({
  args: { messageId: v.id("messages") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.messageId, {
      isDeleted: true,
    });
  },
});

// Add reaction to message
export const addReaction = mutation({
  args: {
    messageId: v.id("messages"),
    userId: v.id("users"),
    emoji: v.string(),
  },
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.messageId);
    if (!message) return;

    const reactions = message.reactions || [];
    const existingReaction = reactions.find((r) => r.userId === args.userId);

    if (existingReaction) {
      // Update existing reaction
      const updated = reactions.map((r) =>
        r.userId === args.userId ? { ...r, emoji: args.emoji } : r
      );
      await ctx.db.patch(args.messageId, { reactions: updated });
    } else {
      // Add new reaction
      await ctx.db.patch(args.messageId, {
        reactions: [...reactions, { userId: args.userId, emoji: args.emoji }],
      });
    }
  },
});
