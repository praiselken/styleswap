import type { Metadata } from "next";
import CreateListingForm from "@/components/CreateListingForm";

export const metadata: Metadata = {
  title: "Create a listing",
  description: "List a piece for sale on StyleSwap — add photos, set a price, go live.",
};

export default function CreateListingPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 pb-16 pt-28 md:pb-24 md:pt-32">
      <h1 className="font-yeseva text-4xl md:text-5xl">Create a listing</h1>
      <p className="mt-3 opacity-80">
        Add photos, set a price, and go live in minutes.
      </p>

      <CreateListingForm />
    </main>
  );
}
