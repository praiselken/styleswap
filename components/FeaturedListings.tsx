"use client";

import { useEffect, useState } from "react";
import ListingCard from "./ListingCard";
import { fetchFeaturedListings, type Listing } from "@/lib/listings";

type LoadState = "loading" | "ready" | "empty" | "error";

export default function FeaturedListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [state, setState] = useState<LoadState>("loading");

  useEffect(() => {
    let cancelled = false;

    fetchFeaturedListings()
      .then((results) => {
        if (cancelled) return;
        setListings(results);
        setState(results.length > 0 ? "ready" : "empty");
      })
      .catch((error) => {
        if (cancelled) return;
        console.error("Failed to load featured listings", error);
        setState("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Nothing to show and nothing wrong — just don't take up space on the
  // landing page until there's something featured.
  if (state === "empty" || state === "error") return null;

  return (
    <section className="py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Trending right now</h2>
            <p className="mt-1 text-sm opacity-75">
              Fresh finds added by the community.
            </p>
          </div>

          <a href="/marketplace" className="text-sm underline">
            View all
          </a>
        </div>

        {state === "loading" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-72 animate-pulse rounded-2xl border border-white/10 bg-white/5"
              />
            ))}
          </div>
        )}

        {state === "ready" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                title={listing.title}
                price={listing.price}
                photo={listing.photos[0]}
                tag={listing.category}
                meta={[listing.brand, listing.condition].filter(Boolean).join(" • ")}
                href={`/listing/${listing.id}`}
                isSample={listing.isSample}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
