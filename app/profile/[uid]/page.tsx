import type { Metadata } from "next";
import ProfileView from "@/components/ProfileView";

export const metadata: Metadata = {
  title: "Profile",
  description: "View a StyleSwap member's profile and listings.",
};

export default async function ProfilePage({ params }: { params: Promise<{ uid: string }> }) {
  const { uid } = await params;

  return (
    <main className="mx-auto max-w-5xl px-4 pb-16 pt-28 md:pb-24 md:pt-32">
      <ProfileView uid={uid} />
    </main>
  );
}
