"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ListingCard from "./ListingCard";
import StarRating from "./StarRating";
import { fetchListings, filterListings, type Listing } from "@/lib/listings";
import { fetchUserProfile, type UserProfile } from "@/lib/users";
import { useFavorites } from "@/lib/useFavorites";
import { mockRatingFor } from "@/lib/mockRating";

type LoadState = "loading" | "ready" | "not-found" | "error";

export default function ProfileView({ uid }: { uid: string }) {
  const { user: viewer, favoriteIds, toggleFavorite } = useFavorites();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [state, setState] = useState<LoadState>("loading");

  useEffect(() => {
    let cancelled = false;

    Promise.all([fetchUserProfile(uid), fetchListings()])
      .then(([fetchedProfile, allListings]) => {
        if (cancelled) return;

        if (!fetchedProfile) {
          setState("not-found");
          return;
        }

        setProfile(fetchedProfile);
        setListings(filterListings(allListings, { sellerId: uid }));
        setState("ready");
      })
      .catch((error) => {
        if (cancelled) return;
        console.error("Failed to load profile", error);
        setState("error");
      });

    return () => {
      cancelled = true;
    };
  }, [uid]);

  if (state === "loading") return null;

  if (state === "not-found") {
    return (
      <div className="rounded-2xl border border-white/20 p-10 text-center">
        <p className="font-medium">We couldn&apos;t find that profile.</p>
        <Link
          href="/marketplace"
          className="mt-6 inline-flex rounded-xl border border-white bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-transparent hover:text-white"
        >
          Browse the marketplace
        </Link>
      </div>
    );
  }

  if (state === "error" || !profile) {
    return (
      <div className="rounded-2xl border border-white/20 p-10 text-center">
        <p className="font-medium">We couldn&apos;t load this profile.</p>
        <p className="mt-1 text-sm opacity-75">Check your connection and try again in a moment.</p>
      </div>
    );
  }

  const isOwnProfile = viewer?.uid === uid;

  return (
    <>
      <header className="mb-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-yeseva text-4xl md:text-5xl">{profile.displayName}</h1>
            <StarRating {...mockRatingFor(uid)} className="mt-2" />
            {profile.location && <p className="mt-2 text-sm opacity-75">{profile.location}</p>}
            {profile.createdAt && (
              <p className="mt-1 text-xs opacity-60">
                Member since{" "}
                {profile.createdAt.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
              </p>
            )}
          </div>

          {isOwnProfile && (
            <Link
              href="/profile/edit"
              className="inline-flex rounded-xl border border-white px-4 py-2 text-sm font-medium transition hover:bg-white hover:text-black"
            >
              Edit profile
            </Link>
          )}
        </div>

        {profile.bio && <p className="mt-4 max-w-2xl opacity-90">{profile.bio}</p>}
      </header>

      <h2 className="mb-4 text-sm font-medium uppercase tracking-wide opacity-70">
        {listings.length === 0
          ? "No active listings"
          : `${listings.length} active ${listings.length === 1 ? "listing" : "listings"}`}
      </h2>

      {listings.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              title={listing.title}
              price={listing.price}
              photo={listing.photos[0]}
              tag={listing.category}
              meta={[listing.brand, listing.condition, listing.size].filter(Boolean).join(" • ")}
              href={`/listing/${listing.id}`}
              favorited={favoriteIds.has(listing.id)}
              onToggleFavorite={viewer ? () => toggleFavorite(listing.id) : undefined}
              isSample={listing.isSample}
            />
          ))}
        </div>
      )}
    </>
  );
}
