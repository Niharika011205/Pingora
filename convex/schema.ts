import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    online: v.boolean(),
    lastSeen: v.number(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_online", ["online"]),

  conversations: defineTable({
    members: v.array(v.id("users")),
    lastMessage: v.optional(v.string()),
    updatedAt: v.number(),
    isGroup: v.optional(v.boolean()),
    groupName: v.optional(v.string()),
    groupImage: v.optional(v.string()),
  })
    .index("by_member", ["members"])
    .index("by_updated_at", ["updatedAt"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    text: v.string(),
    createdAt: v.number(),
    isDeleted: v.boolean(),
    reactions: v.array(
      v.object({
        userId: v.id("users"),
        emoji: v.string(),
      })
    ),
    editedAt: v.optional(v.number()),
    imageUrl: v.optional(v.string()),
    deliveredAt: v.optional(v.number()),
    readBy: v.optional(v.array(
      v.object({
        userId: v.id("users"),
        readAt: v.number(),
      })
    )),
  })
    .index("by_conversation", ["conversationId", "createdAt"])
    .index("by_sender", ["senderId"]),

  typingIndicators: defineTable({
    conversationId: v.id("conversations"),
    userId: v.id("users"),
    expiresAt: v.number(),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_expires", ["expiresAt"])
    .index("by_user", ["userId"]),

  lastRead: defineTable({
    conversationId: v.id("conversations"),
    userId: v.id("users"),
    timestamp: v.number(),
  })
    .index("by_conversation_user", ["conversationId", "userId"])
    .index("by_user", ["userId"]),
});
