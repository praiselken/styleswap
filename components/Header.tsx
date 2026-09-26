"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOutUser } from "@/lib/auth";
import { useAuthUser } from "@/lib/useAuthUser";

const linkClass = "text-sm font-medium opacity-90 transition hover:opacity-100";

export default function Header() {
  const router = useRouter();
  const { user, loading } = useAuthUser();

  async function handleSignOut() {
    await signOutUser();
    router.push("/");
  }

  return (
    <header className="fixed inset-x-0 top-0 z-20 flex items-center justify-between px-4 py-4 md:px-10 md:py-5">
      <Link href="/" className="font-yeseva text-lg tracking-wide md:text-xl">
        StyleSwap
      </Link>

      <nav className="flex items-center gap-3 md:gap-5">
        <Link href="/marketplace" className={`hidden sm:inline-flex ${linkClass}`}>
          Marketplace
        </Link>
        <Link href="/outfits" className={`hidden sm:inline-flex ${linkClass}`}>
          Outfits
        </Link>
        <Link href="/create" className={`hidden sm:inline-flex ${linkClass}`}>
          Sell
        </Link>

        {!loading && (
          user ? (
            <>
              <Link href="/saved" className={`hidden sm:inline-flex ${linkClass}`}>
                Saved
              </Link>
              <Link href="/dashboard" className={linkClass}>
                Dashboard
              </Link>
              <button type="button" onClick={handleSignOut} className={linkClass}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={linkClass}>
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-xl border border-white px-3 py-1.5 text-sm font-medium transition hover:bg-white hover:text-black md:px-4 md:py-2"
              >
                Sign up
              </Link>
            </>
          )
        )}
      </nav>
    </header>
  );
}
