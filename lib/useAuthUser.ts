"use client";

import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { subscribeToAuthState } from "./auth";

/** The signed-in user, or null while loading or signed out (anonymous sessions count as signed out). */
export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return subscribeToAuthState((nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
  }, []);

  return { user, loading };
}
