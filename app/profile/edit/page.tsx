import { Suspense } from "react";
import type { Metadata } from "next";
import EditProfileForm from "@/components/EditProfileForm";

export const metadata: Metadata = {
  title: "Edit profile",
  description: "Update your StyleSwap profile.",
};

export default function EditProfilePage() {
  return (
    <main className="mx-auto max-w-md px-4 pb-16 pt-28 md:pb-24 md:pt-32">
      <h1 className="font-yeseva text-4xl md:text-5xl">Edit profile</h1>
      <p className="mt-3 opacity-80">This is what other members will see.</p>

      <Suspense fallback={null}>
        <EditProfileForm />
      </Suspense>
    </main>
  );
}
