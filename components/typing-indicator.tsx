"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface TypingIndicatorProps {
  conversationId: Id<"conversations">;
  currentUserId: Id<"users">;
}

export function TypingIndicator({
  conversationId,
  currentUserId,
}: TypingIndicatorProps) {
  const typingUsers = useQuery(api.typing.getTypingUsers, {
    conversationId,
    currentUserId,
  });

  if (!typingUsers || typingUsers.length === 0) {
    return null;
  }

  const userName = typingUsers[0]?.name || "Someone";

  return (
    <div className="border-t bg-muted/50 px-4 py-2">
      <p className="text-sm text-muted-foreground">
        {userName} is typing
        <span className="animate-pulse">...</span>
      </p>
    </div>
  );
}
