"use client";

import { useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MessageList } from "@/components/message-list";
import { MessageInput } from "@/components/message-input";
import { TypingIndicator } from "@/components/typing-indicator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

interface ChatWindowProps {
  conversationId: Id<"conversations">;
  currentUserId: Id<"users">;
  onBack?: () => void;
}

export function ChatWindow({
  conversationId,
  currentUserId,
  onBack,
}: ChatWindowProps) {
  const conversation = useQuery(api.conversations.getConversation, {
    conversationId,
  });
  const markAsRead = useMutation(api.messages.markAsRead);
  const clearConversation = useMutation(api.messages.clearConversation);

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const otherUserId = conversation?.members.find((id: Id<"users">) => id !== currentUserId);

  // Get other user by ID
  const users = useQuery(api.users.getAllUsers, { currentUserId });
  const otherUserData = users?.find((u: any) => u._id === otherUserId);

  const handleClearChat = async () => {
    await clearConversation({ conversationId });
    setShowClearConfirm(false);
  };

  useEffect(() => {
    markAsRead({ conversationId, userId: currentUserId });
  }, [conversationId, currentUserId, markAsRead]);

  if (!conversation || !otherUserData) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Loading conversation...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-white p-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="md:hidden"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div className="relative">
            <Avatar>
              <AvatarImage src={otherUserData?.image} />
              <AvatarFallback>
                {otherUserData?.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {otherUserData?.online && (
              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
            )}
          </div>
          <div>
            <p className="font-medium">{otherUserData?.name}</p>
            <p className="text-sm text-muted-foreground">
              {otherUserData?.online ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowClearConfirm(true)}
          className="text-muted-foreground hover:text-destructive"
          title="Clear chat"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages */}
      <MessageList
        conversationId={conversationId}
        currentUserId={currentUserId}
      />

      {/* Typing Indicator */}
      <TypingIndicator
        conversationId={conversationId}
        currentUserId={currentUserId}
      />

      {/* Input */}
      <MessageInput
        conversationId={conversationId}
        currentUserId={currentUserId}
      />

      {/* Clear Chat Confirmation Dialog */}
      <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear Chat</DialogTitle>
            <DialogDescription>
              Are you sure you want to clear all messages in this conversation? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClearConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClearChat}>
              Clear Chat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
