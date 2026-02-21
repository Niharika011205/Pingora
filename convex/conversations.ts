import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get or create a conversation between two users
export const getOrCreateConversation = mutation({
  args: {
    currentUserId: v.id("users"),
    otherUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Check if conversation already exists
    const conversations = await ctx.db.query("conversations").collect();
    
    const existingConversation = conversations.find((conv) => {
      return (
        conv.members.length === 2 &&
        conv.members.includes(args.currentUserId) &&
        conv.members.includes(args.otherUserId) &&
        !conv.isGroup
      );
    });

    if (existingConversation) {
      return existingConversation._id;
    }

    // Create new conversation
    const conversationId = await ctx.db.insert("conversations", {
      members: [args.currentUserId, args.otherUserId],
      updatedAt: Date.now(),
      isGroup: false,
    });

    return conversationId;
  },
});

// Create a group conversation
export const createGroupConversation = mutation({
  args: {
    creatorId: v.id("users"),
    memberIds: v.array(v.id("users")),
    groupName: v.string(),
  },
  handler: async (ctx, args) => {
    const allMembers = [args.creatorId, ...args.memberIds];
    
    const conversationId = await ctx.db.insert("conversations", {
      members: allMembers,
      updatedAt: Date.now(),
      isGroup: true,
      groupName: args.groupName,
    });

    return conversationId;
  },
});

// Get all conversations for current user with details
export const getUserConversations = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const conversations = await ctx.db.query("conversations").collect();
    
    const userConversations = conversations.filter((conv) =>
      conv.members.includes(args.userId)
    );

    // Sort by updatedAt descending
    userConversations.sort((a, b) => b.updatedAt - a.updatedAt);

    // Enrich with other user details and unread count
    const enriched = await Promise.all(
      userConversations.map(async (conv) => {
        let otherUser = null;
        let groupMembers = null;

        if (conv.isGroup) {
          // Get all group members
          groupMembers = await Promise.all(
            conv.members.map((id) => ctx.db.get(id))
          );
        } else {
          // Get the other user in 1-on-1 chat
          const otherUserId = conv.members.find((id) => id !== args.userId);
          otherUser = otherUserId ? await ctx.db.get(otherUserId) : null;
        }

        // Get unread count
        const lastReadRecord = await ctx.db
          .query("lastRead")
          .withIndex("by_conversation_user", (q) =>
            q.eq("conversationId", conv._id).eq("userId", args.userId)
          )
          .unique();

        const lastReadTimestamp = lastReadRecord?.timestamp || 0;

        const messages = await ctx.db
          .query("messages")
          .withIndex("by_conversation", (q) => q.eq("conversationId", conv._id))
          .collect();

        const unreadCount = messages.filter(
          (msg) =>
            msg.createdAt > lastReadTimestamp && msg.senderId !== args.userId
        ).length;

        return {
          ...conv,
          otherUser,
          groupMembers,
          unreadCount,
        };
      })
    );

    return enriched;
  },
});

// Get conversation by ID
export const getConversation = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.conversationId);
  },
});
