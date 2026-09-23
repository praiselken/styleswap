import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create a listing",
  description: "List a piece for sale on Thr-Fit.",
};

export default function CreateListingPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-24">
      <h1 className="font-yeseva text-4xl md:text-5xl">Create a listing</h1>
      <p className="mt-4 opacity-80">
        The listing form is next up. The data layer behind it is already in place:{" "}
        photo uploads and listing writes both work.
      </p>
      <a
        href="/marketplace"
        className="mt-8 inline-flex rounded-xl border border-white px-5 py-3 text-sm font-medium transition hover:bg-white hover:text-black"
      >
        Browse the marketplace
      </a>
    </main>
  );
}
