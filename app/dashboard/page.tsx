import type { Metadata } from "next";
import Dashboard from "@/components/Dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your StyleSwap listings and sales.",
};

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 pb-24 pt-28 md:pt-32">
      <Dashboard />
    </main>
  );
}
