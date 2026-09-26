"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { fetchOutfits, type Outfit } from "@/lib/outfits";

type LoadState = "loading" | "ready" | "error";

export default function OutfitsBrowser() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag");

  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [state, setState] = useState<LoadState>("loading");

  useEffect(() => {
    let cancelled = false;

    fetchOutfits()
      .then((results) => {
        if (cancelled) return;
        setOutfits(results);
        setState("ready");
      })
      .catch((error) => {
        if (cancelled) return;
        console.error("Failed to load outfits", error);
        setState("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const tags = useMemo(() => {
    const unique = new Set<string>();
    outfits.forEach((outfit) => outfit.tags.forEach((tag) => unique.add(tag)));
    return Array.from(unique).sort();
  }, [outfits]);

  const visible = activeTag ? outfits.filter((outfit) => outfit.tags.includes(activeTag)) : outfits;

  function setTag(tag: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (tag) params.set("tag", tag);
    else params.delete("tag");

    const queryString = params.toString();
    router.replace(queryString ? `/outfits?${queryString}` : "/outfits", { scroll: false });
  }

  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 pt-28 md:pt-32">
      <header className="mb-8">
        <h1 className="font-yeseva text-4xl md:text-5xl">Outfits</h1>
        <p className="mt-2 text-sm opacity-75">
          Full looks built from real listings — shop the whole thing, or just the piece you need.
        </p>
      </header>

      {tags.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTag(null)}
            aria-pressed={!activeTag}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              !activeTag ? "border-white bg-white text-black" : "border-white/30 hover:border-white"
            }`}
          >
            All
          </button>

          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setTag(tag)}
              aria-pressed={activeTag === tag}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                activeTag === tag ? "border-white bg-white text-black" : "border-white/30 hover:border-white"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {state === "loading" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-80 animate-pulse rounded-2xl border border-white/10 bg-white/5"
            />
          ))}
        </div>
      )}

      {state === "error" && (
        <div className="rounded-2xl border border-white/20 p-8 text-center">
          <p className="font-medium">We couldn&apos;t load outfits.</p>
          <p className="mt-1 text-sm opacity-75">Check your connection and try again in a moment.</p>
        </div>
      )}

      {state === "ready" && visible.length === 0 && (
        <div className="rounded-2xl border border-white/20 p-10 text-center">
          <p className="font-medium">
            {outfits.length === 0 ? "No outfits yet." : "Nothing matches that tag."}
          </p>
        </div>
      )}

      {state === "ready" && visible.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((outfit) => (
            <a
              key={outfit.id}
              href={`/outfits/${outfit.id}`}
              className="block h-full rounded-2xl focus:outline-2 focus:outline-offset-2"
            >
              <article className="h-full rounded-2xl border border-white/20 bg-black/20 p-4 backdrop-blur-sm transition hover:border-white/50">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-white/10">
                  {outfit.coverPhoto ? (
                    <Image
                      src={outfit.coverPhoto}
                      alt={outfit.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs opacity-50">
                      No photo yet
                    </div>
                  )}
                </div>

                <div className="mt-3">
                  <p className="font-medium">{outfit.title}</p>
                  <p className="mt-1 text-xs opacity-70">
                    {outfit.listingIds.length} {outfit.listingIds.length === 1 ? "piece" : "pieces"}
                  </p>
                  {outfit.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {outfit.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/30 px-2 py-0.5 text-[11px]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
