import { Suspense } from "react";
import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your StyleSwap account.",
};

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-md px-4 pb-16 pt-28 md:pb-24 md:pt-32">
      <h1 className="font-yeseva text-4xl md:text-5xl">Welcome back</h1>
      <p className="mt-3 opacity-80">Log in to manage your listings.</p>

      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
