"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Id } from "@/convex/_generated/dataModel";
import { cn, formatMessageTime } from "@/lib/utils";
import { Smile, Trash2, MoreVertical, Edit2, Check, CheckCheck, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MessageItemProps {
  message: any;
  currentUserId: Id<"users">;
  isOwn: boolean;
}

const QUICK_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🎉"];

export function MessageItem({ message, currentUserId, isOwn }: MessageItemProps) {
  const [showReactions, setShowReactions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text);
  const addReaction = useMutation(api.messages.addReaction);
  const deleteMessage = useMutation(api.messages.deleteMessage);
  const editMessage = useMutation(api.messages.editMessage);

  const handleReaction = async (emoji: string) => {
    await addReaction({
      messageId: message._id,
      userId: currentUserId,
      emoji,
    });
    setShowReactions(false);
  };

  const handleDelete = async () => {
    if (confirm("Delete this message?")) {
      await deleteMessage({ messageId: message._id });
    }
  };

  const handleEdit = async () => {
    if (editText.trim() && editText !== message.text) {
      try {
        await editMessage({ messageId: message._id, text: editText.trim() });
        setIsEditing(false);
      } catch (error: any) {
        alert(error.message || "Cannot edit message");
      }
    } else {
      setIsEditing(false);
    }
  };

  const canEdit = () => {
    const fiveMinutes = 5 * 60 * 1000;
    return Date.now() - message.createdAt < fiveMinutes;
  };

  if (message.isDeleted) {
    return (
      <div className={cn("flex animate-in fade-in-50 duration-300", isOwn ? "justify-end" : "justify-start")}>
        <div className="max-w-[70%] rounded-2xl bg-muted/50 px-4 py-2">
          <p className="text-sm italic text-muted-foreground">🗑️ Message deleted</p>
        </div>
      </div>
    );
  }

  const sender = message.sender;
  const reactions = message.reactions || [];
  const readBy = message.readBy || [];
  const isRead = readBy.length > 0;
  const isDelivered = message.deliveredAt;

  // Group reactions by emoji
  const reactionGroups = reactions.reduce((acc: any, r: any) => {
    if (!acc[r.emoji]) {
      acc[r.emoji] = [];
    }
    acc[r.emoji].push(r.userId);
    return acc;
  }, {});

  return (
    <div
      className={cn(
        "group flex gap-3 animate-in fade-in-50 slide-in-from-bottom-2 duration-300",
        isOwn ? "justify-end" : "justify-start"
      )}
    >
      {!isOwn && sender && (
        <Avatar className="h-9 w-9 ring-2 ring-background">
          <AvatarImage src={sender.image} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm">
            {sender.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}

      <div className="flex flex-col max-w-[70%]">
        <div className="relative">
          <div
            className={cn(
              "rounded-2xl px-4 py-2.5 shadow-sm transition-all duration-200",
              isOwn
                ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                : "bg-white border border-gray-200"
            )}
          >
            {!isOwn && sender && (
              <p className="text-xs font-semibold text-blue-600 mb-1">{sender.name}</p>
            )}

            {isEditing ? (
              <div className="flex gap-2 items-center">
                <Input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleEdit();
                    if (e.key === "Escape") setIsEditing(false);
                  }}
                  className="h-8 text-sm"
                  autoFocus
                />
                <Button size="sm" onClick={handleEdit} className="h-8 w-8 p-0">
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                {message.imageUrl && (
                  <img
                    src={message.imageUrl}
                    alt="Shared image"
                    className="rounded-lg mb-2 max-w-full"
                  />
                )}
                <p className={cn("text-sm leading-relaxed break-words", isOwn ? "text-white" : "text-gray-900")}>
                  {message.text}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <p
                    className={cn(
                      "text-xs",
                      isOwn ? "text-blue-100" : "text-gray-500"
                    )}
                  >
                    {formatMessageTime(message.createdAt)}
                    {message.editedAt && " (edited)"}
                  </p>
                  {isOwn && (
                    <div className="flex items-center">
                      {isRead ? (
                        <CheckCheck className={cn("h-3.5 w-3.5", "text-blue-200")} />
                      ) : isDelivered ? (
                        <CheckCheck className="h-3.5 w-3.5 text-blue-100" />
                      ) : (
                        <Check className="h-3.5 w-3.5 text-blue-100" />
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Action buttons - show on hover */}
          <div
            className={cn(
              "absolute top-0 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100",
              isOwn ? "right-full mr-2" : "left-full ml-2"
            )}
          >
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 bg-white shadow-md hover:bg-gray-100"
              onClick={() => setShowReactions(!showReactions)}
            >
              <Smile className="h-4 w-4 text-gray-600" />
            </Button>

            {isOwn && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 bg-white shadow-md hover:bg-gray-100"
                  >
                    <MoreVertical className="h-4 w-4 text-gray-600" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  {canEdit() && (
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Quick reaction picker */}
          {showReactions && (
            <div
              className={cn(
                "absolute top-full mt-2 flex gap-2 rounded-xl border bg-white p-3 shadow-xl z-10 animate-in fade-in-50 slide-in-from-top-2 duration-200",
                isOwn ? "right-0" : "left-0"
              )}
            >
              {QUICK_REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className="text-2xl transition-transform hover:scale-125 active:scale-110"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Display reactions */}
        {Object.keys(reactionGroups).length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {Object.entries(reactionGroups).map(([emoji, userIds]: [string, any]) => (
              <button
                key={emoji}
                onClick={() => handleReaction(emoji)}
                className={cn(
                  "flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-all hover:scale-105",
                  userIds.includes(currentUserId)
                    ? "border-blue-500 bg-blue-50 shadow-sm"
                    : "border-gray-300 bg-white hover:bg-gray-50"
                )}
              >
                <span className="text-sm">{emoji}</span>
                <span className="text-xs font-medium text-gray-600">{userIds.length}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
