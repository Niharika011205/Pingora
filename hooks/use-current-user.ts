"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";

export function useCurrentUser() {
  const { user: clerkUser, isLoaded } = useUser();
  const syncUser = useMutation(api.users.syncUser);
  
  const convexUser = useQuery(
    api.users.getCurrentUser,
    clerkUser ? { clerkId: clerkUser.id } : "skip"
  );

  useEffect(() => {
    if (isLoaded && clerkUser && !convexUser) {
      syncUser({
        clerkId: clerkUser.id,
        name: clerkUser.fullName || clerkUser.username || "Anonymous",
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        image: clerkUser.imageUrl,
      });
    }
  }, [isLoaded, clerkUser, convexUser, syncUser]);

  return {
    user: convexUser,
    isLoading: !isLoaded || (clerkUser && !convexUser),
  };
}

export type ConvexUser = {
  _id: Id<"users">;
  _creationTime: number;
  clerkId: string;
  name: string;
  email: string;
  image?: string;
  online: boolean;
  lastSeen: number;
};
