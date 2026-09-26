import { Suspense } from "react";
import type { Metadata } from "next";
import SavedListings from "@/components/SavedListings";

export const metadata: Metadata = {
  title: "Saved",
  description: "Items you've saved on StyleSwap.",
};

export default function SavedPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-28 md:pb-24 md:pt-32">
      <h1 className="font-yeseva text-4xl md:text-5xl">Saved</h1>
      <p className="mt-3 mb-8 opacity-80">Everything you&apos;ve favorited, in one place.</p>

      <Suspense fallback={null}>
        <SavedListings />
      </Suspense>
    </main>
  );
}
