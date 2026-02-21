"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Id } from "@/convex/_generated/dataModel";
import { cn, formatConversationTime } from "@/lib/utils";

interface ConversationListProps {
  currentUserId: Id<"users">;
  selectedConversationId?: Id<"conversations">;
  onSelectConversation: (conversationId: Id<"conversations">) => void;
}

export function ConversationList({
  currentUserId,
  selectedConversationId,
  onSelectConversation,
}: ConversationListProps) {
  const conversations = useQuery(api.conversations.getUserConversations, {
    userId: currentUserId,
  });

  if (!conversations || conversations.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-center">
        <div>
          <p className="text-muted-foreground">No conversations yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Select a user to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y overflow-y-auto">
      {conversations.map((conv) => {
        const otherUser = conv.otherUser;
        if (!otherUser) return null;

        return (
          <button
            key={conv._id}
            onClick={() => onSelectConversation(conv._id)}
            className={cn(
              "flex w-full items-start gap-3 p-4 transition hover:bg-accent",
              selectedConversationId === conv._id && "bg-accent"
            )}
          >
            <div className="relative">
              <Avatar>
                <AvatarImage src={otherUser.image} />
                <AvatarFallback>
                  {otherUser.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {otherUser.online && (
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
              )}
            </div>
            <div className="flex-1 overflow-hidden text-left">
              <div className="flex items-center justify-between">
                <p className="font-medium">{otherUser.name}</p>
                <span className="text-xs text-muted-foreground">
                  {formatConversationTime(conv.updatedAt)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <p className="truncate text-sm text-muted-foreground">
                  {conv.lastMessage || "No messages yet"}
                </p>
                {conv.unreadCount > 0 && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
