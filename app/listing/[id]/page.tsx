import type { Metadata } from "next";
import ListingDetail from "@/components/ListingDetail";

export const metadata: Metadata = {
  title: "Listing",
  description: "View this piece on StyleSwap.",
};

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-5xl px-4 pb-16 pt-28 md:pb-24 md:pt-32">
      <ListingDetail id={id} />
    </main>
  );
}
