"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ListingCard from "./ListingCard";
import { fetchOutfit, type Outfit } from "@/lib/outfits";
import { fetchListing, type Listing } from "@/lib/listings";
import { useFavorites } from "@/lib/useFavorites";

type LoadState = "loading" | "ready" | "not-found" | "error";

export default function OutfitDetail({ id }: { id: string }) {
  const { user, favoriteIds, toggleFavorite } = useFavorites();
  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [state, setState] = useState<LoadState>("loading");

  useEffect(() => {
    let cancelled = false;

    fetchOutfit(id)
      .then(async (result) => {
        if (cancelled) return;

        if (!result) {
          setState("not-found");
          return;
        }

        setOutfit(result);

        const pieces = await Promise.all(result.listingIds.map((listingId) => fetchListing(listingId)));
        if (cancelled) return;

        setListings(pieces.filter((piece): piece is Listing => piece !== null));
        setState("ready");
      })
      .catch((error) => {
        if (cancelled) return;
        console.error("Failed to load outfit", error);
        setState("error");
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (state === "loading") return null;

  if (state === "not-found") {
    return (
      <div className="rounded-2xl border border-white/20 p-10 text-center">
        <p className="font-medium">We couldn&apos;t find that outfit.</p>
        <Link
          href="/outfits"
          className="mt-6 inline-flex rounded-xl border border-white bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-transparent hover:text-white"
        >
          Browse outfits
        </Link>
      </div>
    );
  }

  if (state === "error" || !outfit) {
    return (
      <div className="rounded-2xl border border-white/20 p-10 text-center">
        <p className="font-medium">We couldn&apos;t load this outfit.</p>
        <p className="mt-1 text-sm opacity-75">Check your connection and try again in a moment.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-10 md:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white/10">
          {outfit.coverPhoto ? (
            <Image
              src={outfit.coverPhoto}
              alt={outfit.title}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm opacity-50">No photo yet</div>
          )}
        </div>

        <div>
          {outfit.tags.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {outfit.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/30 px-3 py-1 text-xs">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="font-yeseva text-3xl md:text-4xl">{outfit.title}</h1>

          {outfit.description && <p className="mt-4 whitespace-pre-wrap opacity-90">{outfit.description}</p>}

          <p className="mt-6 text-sm opacity-70">
            {listings.length} {listings.length === 1 ? "piece" : "pieces"} in this look
          </p>
        </div>
      </div>

      {listings.length > 0 && (
        <div className="mt-16 border-t border-white/10 pt-10">
          <h2 className="font-yeseva text-2xl">Shop the look</h2>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                title={listing.title}
                price={listing.price}
                photo={listing.photos[0]}
                tag={listing.category}
                meta={[
                  listing.status !== "active" ? "Sold" : null,
                  listing.brand,
                  listing.condition,
                ]
                  .filter(Boolean)
                  .join(" • ")}
                href={`/listing/${listing.id}`}
                favorited={favoriteIds.has(listing.id)}
                onToggleFavorite={user ? () => toggleFavorite(listing.id) : undefined}
                isSample={listing.isSample}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
