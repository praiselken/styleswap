"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ListingCard from "./ListingCard";
import { fetchListings, type Listing } from "@/lib/listings";
import { useFavorites } from "@/lib/useFavorites";
import { useRequireAuth } from "@/lib/useRequireAuth";

type LoadState = "loading" | "ready" | "error";

export default function SavedListings() {
  const { user: authUser, loading: authLoading } = useRequireAuth();
  const { user, favoriteIds, toggleFavorite } = useFavorites();
  const [listings, setListings] = useState<Listing[]>([]);
  const [state, setState] = useState<LoadState>("loading");

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    fetchListings()
      .then((all) => {
        if (cancelled) return;
        // Stored unfiltered — `favoriteIds` is still loading its own fetch
        // inside useFavorites at this point, so filtering against it here
        // would freeze in whatever (possibly empty) state it was in when
        // this effect ran. `visible` below re-filters on every render
        // instead, so it always reflects the current favoriteIds.
        setListings(all);
        setState("ready");
      })
      .catch((error) => {
        if (cancelled) return;
        console.error("Failed to load saved listings", error);
        setState("error");
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  if (authLoading || !authUser) return null;

  const visible = listings.filter((listing) => favoriteIds.has(listing.id));

  if (state === "loading") return null;

  if (state === "error") {
    return (
      <div className="rounded-2xl border border-white/20 p-10 text-center">
        <p className="font-medium">We couldn&apos;t load your saved items.</p>
        <p className="mt-1 text-sm opacity-75">Check your connection and try again in a moment.</p>
      </div>
    );
  }

  if (visible.length === 0) {
    return (
      <div className="rounded-2xl border border-white/20 p-10 text-center">
        <p className="font-medium">Nothing saved yet.</p>
        <p className="mt-1 text-sm opacity-75">Tap the heart on any item to keep it here.</p>
        <Link
          href="/marketplace"
          className="mt-6 inline-flex rounded-xl border border-white bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-transparent hover:text-white"
        >
          Browse the marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {visible.map((listing) => (
        <ListingCard
          key={listing.id}
          title={listing.title}
          price={listing.price}
          photo={listing.photos[0]}
          tag={listing.category}
          meta={[listing.brand, listing.condition, listing.size].filter(Boolean).join(" • ")}
          href={`/listing/${listing.id}`}
          favorited
          onToggleFavorite={() => toggleFavorite(listing.id)}
        />
      ))}
    </div>
  );
}
