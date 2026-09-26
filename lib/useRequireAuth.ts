"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuthUser } from "./useAuthUser";

/**
 * Guards a client page that requires a real, registered account. Redirects
 * signed-out visitors to /login, carrying the current path (and any query
 * string) so login can send them back once they're signed in.
 */
export function useRequireAuth() {
  const { user, loading } = useAuthUser();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (loading || user) return;

    const query = searchParams.toString();
    const redirectTo = query ? `${pathname}?${query}` : pathname;
    router.replace(`/login?redirect=${encodeURIComponent(redirectTo)}`);
  }, [loading, user, pathname, searchParams, router]);

  return { user, loading };
}
