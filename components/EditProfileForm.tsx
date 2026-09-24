"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateProfile } from "firebase/auth";
import { fetchUserProfile, updateUserProfile } from "@/lib/users";
import { useAuthUser } from "@/lib/useAuthUser";

const schema = z.object({
  displayName: z.string().trim().min(2, "Enter your name.").max(60),
  bio: z.string().trim().max(300, "Keep your bio under 300 characters.").optional(),
  location: z.string().trim().max(60).optional(),
});

type FormValues = z.input<typeof schema>;

const labelClass = "block text-sm font-medium";
const fieldClass =
  "mt-2 w-full rounded-xl border border-white/30 bg-black/30 px-4 py-3 text-sm placeholder:text-white/40 focus:border-white focus:outline-none";
const errorClass = "mt-1 text-xs text-red-300";

export default function EditProfileForm() {
  const router = useRouter();
  const { user, loading: userLoading } = useAuthUser();
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (!user) return;

    fetchUserProfile(user.uid)
      .then((profile) => {
        reset({
          displayName: profile?.displayName ?? user.displayName ?? "",
          bio: profile?.bio ?? "",
          location: profile?.location ?? "",
        });
      })
      .finally(() => setLoadingProfile(false));
  }, [user, reset]);

  async function onSubmit(values: FormValues) {
    if (!user) return;
    setSubmitError(null);

    try {
      const parsed = schema.parse(values);
      await updateUserProfile(user.uid, parsed);
      await updateProfile(user, { displayName: parsed.displayName });
      router.push(`/profile/${user.uid}`);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Something went wrong. Please try again."
      );
    }
  }

  if (userLoading || (user && loadingProfile)) return null;

  if (!user) {
    return <p className="opacity-80">Log in to edit your profile.</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6" noValidate>
      <fieldset disabled={isSubmitting} className="space-y-6">
        <div>
          <label htmlFor="displayName" className={labelClass}>
            Name
          </label>
          <input id="displayName" {...register("displayName")} className={fieldClass} />
          {errors.displayName && <p className={errorClass}>{errors.displayName.message}</p>}
        </div>

        <div>
          <label htmlFor="location" className={labelClass}>
            Location <span className="opacity-60">(optional)</span>
          </label>
          <input
            id="location"
            {...register("location")}
            placeholder="Manchester, UK"
            className={fieldClass}
          />
          {errors.location && <p className={errorClass}>{errors.location.message}</p>}
        </div>

        <div>
          <label htmlFor="bio" className={labelClass}>
            Bio <span className="opacity-60">(optional)</span>
          </label>
          <textarea
            id="bio"
            rows={4}
            {...register("bio")}
            placeholder="What do you sell? What do you look for?"
            className={fieldClass}
          />
          {errors.bio && <p className={errorClass}>{errors.bio.message}</p>}
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
        className="w-full rounded-xl border border-white bg-white px-6 py-3 font-medium text-black transition hover:bg-transparent hover:text-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
