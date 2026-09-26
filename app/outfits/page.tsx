import { Suspense } from "react";
import type { Metadata } from "next";
import OutfitsBrowser from "@/components/OutfitsBrowser";

export const metadata: Metadata = {
  title: "Outfits",
  description: "Full looks built from real StyleSwap listings — shop the whole outfit or just one piece.",
};

export default function OutfitsPage() {
  return (
    <main>
      <Suspense fallback={<div className="min-h-screen" />}>
        <OutfitsBrowser />
      </Suspense>
    </main>
  );
}
