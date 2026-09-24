import { Suspense } from "react";
import type { Metadata } from "next";
import MarketplaceBrowser from "@/components/MarketplaceBrowser";

export const metadata: Metadata = {
  title: "Marketplace",
  description:
    "Browse every piece listed by the StyleSwap community — hoodies, jackets, vintage, streetwear and more.",
};

export default function MarketplacePage() {
  return (
    <main>
      <Suspense fallback={<div className="min-h-screen" />}>
        <MarketplaceBrowser />
      </Suspense>
    </main>
  );
}
