"use client";

import Link from "next/link";
import { useAuthUser } from "@/lib/useAuthUser";

export default function Dashboard() {
  const { user, loading } = useAuthUser();

  if (loading) return null;

  if (!user) {
    return (
      <>
        <h1 className="font-yeseva text-4xl md:text-5xl">Your dashboard</h1>
        <p className="mt-4 opacity-80">Log in to see your listings and sales.</p>
        <div className="mt-8 flex gap-3">
          <Link
            href="/login"
            className="inline-flex rounded-xl border border-white bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-transparent hover:text-white"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="inline-flex rounded-xl border border-white px-5 py-3 text-sm font-medium transition hover:bg-white hover:text-black"
          >
            Sign up
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="font-yeseva text-4xl md:text-5xl">
        Welcome, {user.displayName ?? user.email}
      </h1>
      <p className="mt-4 opacity-80">Your listings and sales will live here.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href={`/profile/${user.uid}`}
          className="inline-flex rounded-xl border border-white bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-transparent hover:text-white"
        >
          View public profile
        </Link>
        <Link
          href="/profile/edit"
          className="inline-flex rounded-xl border border-white px-5 py-3 text-sm font-medium transition hover:bg-white hover:text-black"
        >
          Edit profile
        </Link>
        <Link
          href="/saved"
          className="inline-flex rounded-xl border border-white px-5 py-3 text-sm font-medium transition hover:bg-white hover:text-black"
        >
          Saved items
        </Link>
        <Link
          href="/marketplace"
          className="inline-flex rounded-xl border border-white px-5 py-3 text-sm font-medium transition hover:bg-white hover:text-black"
        >
          Browse the marketplace
        </Link>
      </div>
    </>
  );
}
