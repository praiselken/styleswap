"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authErrorMessage, signInWithEmail } from "@/lib/auth";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

type FormValues = z.input<typeof schema>;

const labelClass = "block text-sm font-medium";
const fieldClass =
  "mt-2 w-full rounded-xl border border-white/30 bg-black/30 px-4 py-3 text-sm placeholder:text-white/40 focus:border-white focus:outline-none";
const errorClass = "mt-1 text-xs text-red-300";

export default function LoginForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setSubmitError(null);
    try {
      const parsed = schema.parse(values);
      await signInWithEmail(parsed.email, parsed.password);
      router.push("/dashboard");
    } catch (error) {
      setSubmitError(authErrorMessage(error));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6" noValidate>
      <fieldset disabled={isSubmitting} className="space-y-6">
        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register("email")}
            placeholder="you@example.com"
            className={fieldClass}
          />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register("password")}
            placeholder="Your password"
            className={fieldClass}
          />
          {errors.password && <p className={errorClass}>{errors.password.message}</p>}
        </div>
      </fieldset>

      {submitError && (
        <p role="alert" className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl border border-white bg-white px-6 py-3 font-medium text-black transition hover:bg-transparent hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Logging in…" : "Log in"}
      </button>

      <p className="text-center text-sm opacity-75">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="underline underline-offset-2 hover:opacity-100">
          Sign up
        </Link>
      </p>
    </form>
  );
}
