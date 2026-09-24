"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchListing, type Listing } from "@/lib/listings";
import { fetchUserProfile } from "@/lib/users";

type LoadState = "loading" | "ready" | "not-found" | "error";

export default function ListingDetail({ id }: { id: string }) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [sellerName, setSellerName] = useState<string | null>(null);
  const [state, setState] = useState<LoadState>("loading");
  const [activePhoto, setActivePhoto] = useState(0);

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

        const profile = await fetchUserProfile(result.sellerId);
        if (!cancelled) setSellerName(profile?.displayName ?? null);
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

  return (
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

        <h1 className="font-yeseva text-3xl md:text-4xl">{listing.title}</h1>
        <p className="mt-2 text-2xl font-semibold">£{listing.price}</p>

        {meta && <p className="mt-3 text-sm opacity-75">{meta}</p>}

        {listing.description && (
          <p className="mt-6 whitespace-pre-wrap opacity-90">{listing.description}</p>
        )}

        <Link
          href={`/profile/${listing.sellerId}`}
          className="mt-8 inline-flex items-center gap-2 text-sm underline underline-offset-2 opacity-90 hover:opacity-100"
        >
          Sold by {sellerName ?? "a StyleSwap member"}
        </Link>
      </div>
    </div>
  );
}
