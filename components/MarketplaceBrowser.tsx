"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ListingCard from "./ListingCard";
import { CATEGORIES, fetchListings, filterListings, type Listing } from "@/lib/listings";

type LoadState = "loading" | "ready" | "error";

export default function MarketplaceBrowser() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = searchParams.get("category");
  const search = searchParams.get("q") ?? "";

  const [listings, setListings] = useState<Listing[]>([]);
  const [state, setState] = useState<LoadState>("loading");
  const [searchDraft, setSearchDraft] = useState(search);

  useEffect(() => {
    let cancelled = false;

    setState("loading");
    fetchListings()
      .then((results) => {
        if (cancelled) return;
        setListings(results);
        setState("ready");
      })
      .catch((error) => {
        if (cancelled) return;
        console.error("Failed to load listings", error);
        setState("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Keep the input in step when the URL changes from outside (back button, category links).
  useEffect(() => setSearchDraft(search), [search]);

  const visible = useMemo(
    () => filterListings(listings, { category, search }),
    [listings, category, search]
  );

  function updateParams(next: { category?: string | null; q?: string | null }) {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(next)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }

    const queryString = params.toString();
    router.replace(queryString ? `/marketplace?${queryString}` : "/marketplace", {
      scroll: false,
    });
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-8">
        <h1 className="font-yeseva text-4xl md:text-5xl">Marketplace</h1>
        <p className="mt-2 text-sm opacity-75">
          Every piece listed by the Thr-Fit community.
        </p>
      </header>

      <form
        className="mb-6 flex gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          updateParams({ q: searchDraft });
        }}
      >
        <input
          type="search"
          value={searchDraft}
          onChange={(event) => setSearchDraft(event.target.value)}
          placeholder="Search for a jacket, a brand, a vibe…"
          aria-label="Search listings"
          className="w-full rounded-xl border border-white/30 bg-black/30 px-4 py-3 text-sm placeholder:text-white/40 focus:border-white focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-xl border border-white bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-transparent hover:text-white"
        >
          Search
        </button>
      </form>

      <div className="mb-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => updateParams({ category: null })}
          aria-pressed={!category}
          className={`rounded-full border px-4 py-2 text-sm transition ${
            !category
              ? "border-white bg-white text-black"
              : "border-white/30 hover:border-white"
          }`}
        >
          All
        </button>

        {CATEGORIES.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => updateParams({ category: name })}
            aria-pressed={category === name}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              category === name
                ? "border-white bg-white text-black"
                : "border-white/30 hover:border-white"
            }`}
          >
            {name}
          </button>
        ))}
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

      {state === "error" && (
        <div className="rounded-2xl border border-white/20 p-8 text-center">
          <p className="font-medium">We couldn&apos;t load the marketplace.</p>
          <p className="mt-1 text-sm opacity-75">
            Check your connection and try again in a moment.
          </p>
        </div>
      )}

      {state === "ready" && visible.length === 0 && (
        <div className="rounded-2xl border border-white/20 p-10 text-center">
          <p className="font-medium">
            {listings.length === 0
              ? "No listings yet — this marketplace is brand new."
              : "Nothing matches those filters."}
          </p>
          <p className="mt-1 text-sm opacity-75">
            {listings.length === 0
              ? "Be the first to put something up for sale."
              : "Try a different category, or clear your search."}
          </p>
          <a
            href={listings.length === 0 ? "/create" : "/marketplace"}
            className="mt-6 inline-flex rounded-xl border border-white bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-transparent hover:text-white"
          >
            {listings.length === 0 ? "Create a listing" : "Clear filters"}
          </a>
        </div>
      )}

      {state === "ready" && visible.length > 0 && (
        <>
          <p className="mb-4 text-sm opacity-70" aria-live="polite">
            {visible.length} {visible.length === 1 ? "item" : "items"}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((listing) => (
              <ListingCard
                key={listing.id}
                title={listing.title}
                price={listing.price}
                photo={listing.photos[0]}
                tag={listing.category}
                meta={[listing.condition, listing.size].filter(Boolean).join(" • ")}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
