"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

interface UserListProps {
  currentUserId: Id<"users">;
  onSelectUser: (userId: Id<"users">) => void;
}

export function UserList({ currentUserId, onSelectUser }: UserListProps) {
  const [search, setSearch] = useState("");
  const users = useQuery(api.users.getAllUsers, { currentUserId });

  const filteredUsers = users?.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <h2 className="mb-3 text-lg font-semibold">Users</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredUsers && filteredUsers.length > 0 ? (
          <div className="divide-y">
            {filteredUsers.map((user) => (
              <button
                key={user._id}
                onClick={() => onSelectUser(user._id)}
                className="flex w-full items-center gap-3 p-4 transition hover:bg-accent"
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={user.image} />
                    <AvatarFallback>
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {user.online && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {user.online ? "Online" : "Offline"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center p-8 text-center">
            <p className="text-muted-foreground">
              {search ? "No users found" : "No users available"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
