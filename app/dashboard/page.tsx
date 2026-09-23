import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your Thr-Fit listings and sales.",
};

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-24">
      <h1 className="font-yeseva text-4xl md:text-5xl">Your dashboard</h1>
      <p className="mt-4 opacity-80">
        Your listings, sales and profile will live here once accounts are wired up.
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
