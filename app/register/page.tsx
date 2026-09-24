import type { Metadata } from "next";
import RegisterForm from "@/components/RegisterForm";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Sign up for StyleSwap to list items and track your sales.",
};

export default function RegisterPage() {
  return (
    <main className="mx-auto max-w-md px-4 pb-16 pt-28 md:pb-24 md:pt-32">
      <h1 className="font-yeseva text-4xl md:text-5xl">Create an account</h1>
      <p className="mt-3 opacity-80">Join StyleSwap to list items and track your sales.</p>

      <RegisterForm />
    </main>
  );
}
