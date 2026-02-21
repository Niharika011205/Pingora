"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { Navbar } from "@/components/navbar";
import { UserList } from "@/components/user-list";
import { ConversationList } from "@/components/conversation-list";
import { ChatWindow } from "@/components/chat-window";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const { user, isLoading } = useCurrentUser();
  const [selectedConversationId, setSelectedConversationId] = useState<
    Id<"conversations"> | null
  >(null);
  const [showUserList, setShowUserList] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  
  const getOrCreateConversation = useMutation(
    api.conversations.getOrCreateConversation
  );

  useOnlineStatus(user?._id);

  const handleSelectUser = async (userId: Id<"users">) => {
    if (!user) return;

    const conversationId = await getOrCreateConversation({
      currentUserId: user._id,
      otherUserId: userId,
    });

    setSelectedConversationId(conversationId);
    setShowUserList(false);
    setIsMobileView(true);
  };

  const handleSelectConversation = (conversationId: Id<"conversations">) => {
    setSelectedConversationId(conversationId);
    setIsMobileView(true);
  };

  const handleBack = () => {
    setIsMobileView(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Please sign in to continue</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Desktop always visible, Mobile conditional */}
        <div
          className={cn(
            "w-full border-r bg-white md:w-96 lg:w-[400px]",
            isMobileView && "hidden md:block"
          )}
        >
          <div className="flex h-full flex-col">
            {/* Toggle between Users and Conversations */}
            <div className="flex border-b">
              <button
                onClick={() => setShowUserList(false)}
                className={cn(
                  "flex-1 border-b-2 px-4 py-3 text-sm font-medium transition",
                  !showUserList
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                Conversations
              </button>
              <button
                onClick={() => setShowUserList(true)}
                className={cn(
                  "flex-1 border-b-2 px-4 py-3 text-sm font-medium transition",
                  showUserList
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                Users
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              {showUserList ? (
                <UserList
                  currentUserId={user._id}
                  onSelectUser={handleSelectUser}
                />
              ) : (
                <ConversationList
                  currentUserId={user._id}
                  selectedConversationId={selectedConversationId || undefined}
                  onSelectConversation={handleSelectConversation}
                />
              )}
            </div>
          </div>
        </div>

        {/* Chat Window */}
        <div
          className={cn(
            "flex-1 bg-gray-50",
            !isMobileView && "hidden md:flex"
          )}
        >
          {selectedConversationId ? (
            <ChatWindow
              conversationId={selectedConversationId}
              currentUserId={user._id}
              onBack={handleBack}
            />
          ) : (
            <div className="flex h-full items-center justify-center p-8 text-center">
              <div>
                <p className="text-lg text-muted-foreground">
                  Select a conversation to start chatting
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Or choose a user from the Users tab
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
