"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { MessageItem } from "@/components/message-item";
import { Id } from "@/convex/_generated/dataModel";
import { ArrowDown } from "lucide-react";

interface MessageListProps {
  conversationId: Id<"conversations">;
  currentUserId: Id<"users">;
}

export function MessageList({
  conversationId,
  currentUserId,
}: MessageListProps) {
  const messages = useQuery(api.messages.getMessages, { conversationId });
  const markAsRead = useMutation(api.messages.markAsRead);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(true);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    
    const nearBottom = distanceFromBottom < 100;
    setIsNearBottom(nearBottom);
    setShowScrollButton(!nearBottom && !!messages && messages.length > 0);
  };

  useEffect(() => {
    if (isNearBottom) {
      scrollToBottom();
    }
  }, [messages, isNearBottom]);

  // Mark as read when messages change and user is near bottom
  useEffect(() => {
    if (messages && messages.length > 0 && isNearBottom) {
      markAsRead({ conversationId, userId: currentUserId });
    }
  }, [messages, isNearBottom, conversationId, currentUserId, markAsRead]);

  if (!messages) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Loading messages...</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-center">
        <div>
          <p className="text-muted-foreground">No messages yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Send a message to start the conversation
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex-1 overflow-hidden">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto p-4"
      >
        <div className="space-y-4">
          {messages.map((message: any) => {
            const isOwn = message.senderId === currentUserId;
            return (
              <MessageItem
                key={message._id}
                message={message}
                currentUserId={currentUserId}
                isOwn={isOwn}
              />
            );
          })}
        </div>
      </div>

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
    </div>
  );
}
