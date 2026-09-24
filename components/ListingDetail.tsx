"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ListingCard from "./ListingCard";
import StarRating from "./StarRating";
import { fetchListing, fetchListings, filterListings, type Listing } from "@/lib/listings";
import { fetchUserProfile } from "@/lib/users";
import { mockRatingFor } from "@/lib/mockRating";
import { useFavorites } from "@/lib/useFavorites";

type LoadState = "loading" | "ready" | "not-found" | "error";

export default function ListingDetail({ id }: { id: string }) {
  const { user, favoriteIds, toggleFavorite } = useFavorites();
  const [listing, setListing] = useState<Listing | null>(null);
  const [sellerName, setSellerName] = useState<string | null>(null);
  const [otherListings, setOtherListings] = useState<Listing[]>([]);
  const [state, setState] = useState<LoadState>("loading");
  const [activePhoto, setActivePhoto] = useState(0);

  // Reset the gallery to the cover photo the moment `id` changes — during
  // render rather than in the effect below, so switching listings (e.g. via
  // the "more from this seller" row) never briefly shows the old photo index
  // against the new listing's gallery.
  const [loadedId, setLoadedId] = useState(id);
  if (id !== loadedId) {
    setLoadedId(id);
    setActivePhoto(0);
  }

  useEffect(() => {
    let cancelled = false;

    fetchListing(id)
      .then(async (result) => {
        if (cancelled) return;

        if (!result) {
          setState("not-found");
          return;
        }

        setListing(result);
        setState("ready");

        const [profile, sellerListings] = await Promise.all([
          fetchUserProfile(result.sellerId),
          fetchListings().then((all) =>
            filterListings(all, { sellerId: result.sellerId }).filter((l) => l.id !== result.id)
          ),
        ]);

        if (cancelled) return;
        setSellerName(profile?.displayName ?? null);
        setOtherListings(sellerListings);
      })
      .catch((error) => {
        if (cancelled) return;
        console.error("Failed to load listing", error);
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
        <p className="font-medium">We couldn&apos;t find that listing.</p>
        <Link
          href="/marketplace"
          className="mt-6 inline-flex rounded-xl border border-white bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-transparent hover:text-white"
        >
          Browse the marketplace
        </Link>
      </div>
    );
  }

  if (state === "error" || !listing) {
    return (
      <div className="rounded-2xl border border-white/20 p-10 text-center">
        <p className="font-medium">We couldn&apos;t load this listing.</p>
        <p className="mt-1 text-sm opacity-75">Check your connection and try again in a moment.</p>
      </div>
    );
  }

  const meta = [listing.condition, listing.size, listing.location].filter(Boolean).join(" • ");
  const cover = listing.photos[activePhoto];
  const favorited = favoriteIds.has(listing.id);

  return (
    <div>
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white/10">
            {cover ? (
              <Image
                src={cover}
                alt={listing.title}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm opacity-50">
                No photo yet
              </div>
            )}

            {user && (
              <button
                type="button"
                onClick={() => toggleFavorite(listing.id)}
                aria-label={favorited ? "Remove from saved" : "Save item"}
                aria-pressed={favorited}
                className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm transition hover:bg-black/70"
              >
                <span aria-hidden className={favorited ? "text-red-400" : "text-white"}>
                  {favorited ? "♥" : "♡"}
                </span>
              </button>
            )}
          </div>

          {listing.photos.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {listing.photos.map((photo, index) => (
                <button
                  key={photo}
                  type="button"
                  onClick={() => setActivePhoto(index)}
                  aria-label={`View photo ${index + 1}`}
                  aria-pressed={index === activePhoto}
                  className={`relative aspect-square overflow-hidden rounded-xl border transition ${
                    index === activePhoto ? "border-white" : "border-white/20 hover:border-white/50"
                  }`}
                >
                  <Image src={photo} alt="" fill sizes="20vw" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {listing.status !== "active" && (
            <span className="mb-4 inline-flex rounded-full border border-white/30 px-3 py-1 text-xs uppercase tracking-wide opacity-75">
              {listing.status === "sold" ? "Sold" : "No longer available"}
            </span>
          )}

          {listing.category && (
            <span className="mb-3 inline-flex rounded-full border border-white/30 px-3 py-1 text-xs">
              {listing.category}
            </span>
          )}

          {listing.brand && <p className="text-sm font-medium opacity-80">{listing.brand}</p>}
          <h1 className="font-yeseva text-3xl md:text-4xl">{listing.title}</h1>
          <p className="mt-2 text-2xl font-semibold">£{listing.price}</p>

          {meta && <p className="mt-3 text-sm opacity-75">{meta}</p>}

          {listing.description && (
            <p className="mt-6 whitespace-pre-wrap opacity-90">{listing.description}</p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={`/profile/${listing.sellerId}`}
              className="text-sm underline underline-offset-2 opacity-90 hover:opacity-100"
            >
              Sold by {sellerName ?? "a StyleSwap member"}
            </Link>
            <StarRating {...mockRatingFor(listing.sellerId)} />
          </div>
        </div>
      </div>

      {otherListings.length > 0 && (
        <div className="mt-16 border-t border-white/10 pt-10">
          <h2 className="font-yeseva text-2xl">More from {sellerName ?? "this seller"}</h2>
          <p className="mt-1 text-sm opacity-75">
            Buy 2 or more from the same seller and ask about a bundle price.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {otherListings.slice(0, 4).map((other) => (
              <ListingCard
                key={other.id}
                title={other.title}
                price={other.price}
                photo={other.photos[0]}
                tag={other.category}
                meta={[other.brand, other.condition].filter(Boolean).join(" • ")}
                href={`/listing/${other.id}`}
                favorited={favoriteIds.has(other.id)}
                onToggleFavorite={user ? () => toggleFavorite(other.id) : undefined}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
