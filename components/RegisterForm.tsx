"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authErrorMessage, registerWithEmail } from "@/lib/auth";

const schema = z
  .object({
    name: z.string().trim().min(2, "Enter your name."),
    email: z.string().trim().email("Enter a valid email address."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

type FormValues = z.input<typeof schema>;

const labelClass = "block text-sm font-medium";
const fieldClass =
  "mt-2 w-full rounded-xl border border-white/30 bg-black/30 px-4 py-3 text-sm placeholder:text-white/40 focus:border-white focus:outline-none";
const errorClass = "mt-1 text-xs text-red-300";

export default function RegisterForm() {
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
      await registerWithEmail(parsed.email, parsed.password, parsed.name);
      router.push("/dashboard");
    } catch (error) {
      setSubmitError(authErrorMessage(error));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6" noValidate>
      <fieldset disabled={isSubmitting} className="space-y-6">
        <div>
          <label htmlFor="name" className={labelClass}>
            Name
          </label>
          <input
            id="name"
            autoComplete="name"
            {...register("name")}
            placeholder="Jordan Lee"
            className={fieldClass}
          />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>

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
            autoComplete="new-password"
            {...register("password")}
            placeholder="At least 6 characters"
            className={fieldClass}
          />
          {errors.password && <p className={errorClass}>{errors.password.message}</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword" className={labelClass}>
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            {...register("confirmPassword")}
            className={fieldClass}
          />
          {errors.confirmPassword && <p className={errorClass}>{errors.confirmPassword.message}</p>}
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
        {isSubmitting ? "Creating account…" : "Create account"}
      </button>

      <p className="text-center text-sm opacity-75">
        Already have an account?{" "}
        <Link href="/login" className="underline underline-offset-2 hover:opacity-100">
          Log in
        </Link>
      </p>
    </form>
  );
}
