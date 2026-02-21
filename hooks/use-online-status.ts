"use client";

import { useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function useOnlineStatus(userId: Id<"users"> | undefined) {
  const updateStatus = useMutation(api.users.updateOnlineStatus);
  const heartbeat = useMutation(api.users.heartbeat);

  useEffect(() => {
    if (!userId) return;

    // Set online on mount
    updateStatus({ userId, online: true });

    // Heartbeat every 30 seconds
    const interval = setInterval(() => {
      heartbeat({ userId });
    }, 30000);

    // Set offline on unmount
    return () => {
      clearInterval(interval);
      updateStatus({ userId, online: false });
    };
  }, [userId, updateStatus, heartbeat]);
}
