import type { Metadata } from "next";
import OutfitDetail from "@/components/OutfitDetail";

export const metadata: Metadata = {
  title: "Outfit",
  description: "Shop this look on StyleSwap.",
};

export default async function OutfitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-5xl px-4 pb-16 pt-28 md:pb-24 md:pt-32">
      <OutfitDetail id={id} />
    </main>
  );
}
