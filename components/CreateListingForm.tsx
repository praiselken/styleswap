"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CATEGORIES, CONDITIONS, createListing } from "@/lib/listings";
import { MAX_PHOTO_BYTES, uploadListingPhotos } from "@/lib/storageUploads";
import { ensureSignedIn } from "@/lib/auth";

const MAX_PHOTOS = 6;

const schema = z.object({
  title: z.string().trim().min(3, "Give it a title of at least 3 characters.").max(80),
  description: z
    .string()
    .trim()
    .min(10, "Tell buyers a little more — at least 10 characters.")
    .max(1000, "Keep the description under 1000 characters."),
  price: z.coerce
    .number({ message: "Enter a price." })
    .positive("Price must be more than £0.")
    .max(10000, "Listings over £10,000 need to go through support."),
  category: z.enum(CATEGORIES, { message: "Pick a category." }),
  condition: z.enum(CONDITIONS, { message: "Pick a condition." }),
  size: z.string().trim().max(20).optional(),
  location: z.string().trim().max(60).optional(),
});

type FormValues = z.input<typeof schema>;

type Photo = { file: File; preview: string };

const labelClass = "block text-sm font-medium";
const fieldClass =
  "mt-2 w-full rounded-xl border border-white/30 bg-black/30 px-4 py-3 text-sm placeholder:text-white/40 focus:border-white focus:outline-none";
const errorClass = "mt-1 text-xs text-red-300";

export default function CreateListingForm() {
  const router = useRouter();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  // Object URLs leak if nothing revokes them. removePhoto handles the ones the
  // user drops; this releases whatever is still held when the form goes away.
  // It reads through a ref so adding a photo doesn't revoke the previews of the
  // photos already on screen.
  const photosRef = useRef(photos);
  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);
  useEffect(() => {
    return () => photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.preview));
  }, []);

  function addPhotos(files: FileList | null) {
    if (!files?.length) return;
    setPhotoError(null);

    const incoming = Array.from(files);
    const room = MAX_PHOTOS - photos.length;

    if (incoming.length > room) {
      setPhotoError(`You can add up to ${MAX_PHOTOS} photos.`);
    }

    const accepted: Photo[] = [];
    for (const file of incoming.slice(0, Math.max(room, 0))) {
      if (file.size > MAX_PHOTO_BYTES) {
        setPhotoError(`${file.name} is larger than 5MB.`);
        continue;
      }
      accepted.push({ file, preview: URL.createObjectURL(file) });
    }

    setPhotos((current) => [...current, ...accepted]);
    if (fileInput.current) fileInput.current.value = "";
  }

  function removePhoto(index: number) {
    setPhotos((current) => {
      URL.revokeObjectURL(current[index].preview);
      return current.filter((_, i) => i !== index);
    });
  }

  /** Photos live outside react-hook-form, so they need checking on both paths. */
  function photosMissing() {
    if (photos.length > 0) return false;
    setPhotoError("Add at least one photo — listings with photos sell far faster.");
    return true;
  }

  async function onSubmit(values: FormValues) {
    setSubmitError(null);

    if (photosMissing()) return;

    try {
      const parsed = schema.parse(values);
      const user = await ensureSignedIn();
      const urls = await uploadListingPhotos(user.uid, photos.map((photo) => photo.file));

      await createListing({
        sellerId: user.uid,
        title: parsed.title,
        description: parsed.description,
        price: parsed.price,
        category: parsed.category,
        condition: parsed.condition,
        size: parsed.size || undefined,
        location: parsed.location || undefined,
        photos: urls,
      });

      router.push("/marketplace");
    } catch (error) {
      console.error("Failed to create listing", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong publishing your listing. Please try again."
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, () => photosMissing())}
      className="mt-10 space-y-8"
      noValidate
    >
      <fieldset disabled={isSubmitting} className="space-y-8">
        <div>
          <span className={labelClass}>Photos</span>
          <p className="mt-1 text-xs opacity-70">
            Up to {MAX_PHOTOS} images, 5MB each. The first one is the cover.
          </p>

          <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {photos.map((photo, index) => (
              <div
                key={photo.preview}
                className="relative aspect-square overflow-hidden rounded-xl border border-white/20"
              >
                <Image
                  src={photo.preview}
                  alt={`Photo ${index + 1}`}
                  fill
                  unoptimized
                  className="object-cover"
                />
                {index === 0 && (
                  <span className="absolute left-1 top-1 rounded-full bg-black/70 px-2 py-0.5 text-[10px]">
                    Cover
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  aria-label={`Remove photo ${index + 1}`}
                  className="absolute right-1 top-1 rounded-full bg-black/70 px-2 py-0.5 text-xs hover:bg-black"
                >
                  ✕
                </button>
              </div>
            ))}

            {photos.length < MAX_PHOTOS && (
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-white/40 text-sm opacity-80 transition hover:border-white hover:opacity-100"
              >
                + Add
              </button>
            )}
          </div>

          <input
            ref={fileInput}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="sr-only"
            onChange={(event) => addPhotos(event.target.files)}
          />
          {photoError && <p className={errorClass}>{photoError}</p>}
        </div>

        <div>
          <label htmlFor="title" className={labelClass}>
            Title
          </label>
          <input
            id="title"
            {...register("title")}
            placeholder="Vintage Carhartt Detroit Jacket"
            className={fieldClass}
          />
          {errors.title && <p className={errorClass}>{errors.title.message}</p>}
        </div>

        <div>
          <label htmlFor="description" className={labelClass}>
            Description
          </label>
          <textarea
            id="description"
            rows={5}
            {...register("description")}
            placeholder="Fit, fabric, flaws, why you loved it…"
            className={fieldClass}
          />
          {errors.description && <p className={errorClass}>{errors.description.message}</p>}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="price" className={labelClass}>
              Price (£)
            </label>
            <input
              id="price"
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              {...register("price")}
              placeholder="45"
              className={fieldClass}
            />
            {errors.price && <p className={errorClass}>{errors.price.message}</p>}
          </div>

          <div>
            <label htmlFor="size" className={labelClass}>
              Size <span className="opacity-60">(optional)</span>
            </label>
            <input id="size" {...register("size")} placeholder="M" className={fieldClass} />
            {errors.size && <p className={errorClass}>{errors.size.message}</p>}
          </div>

          <div>
            <label htmlFor="category" className={labelClass}>
              Category
            </label>
            <select id="category" defaultValue="" {...register("category")} className={fieldClass}>
              <option value="" disabled>
                Choose one
              </option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category} className="bg-black">
                  {category}
                </option>
              ))}
            </select>
            {errors.category && <p className={errorClass}>{errors.category.message}</p>}
          </div>

          <div>
            <label htmlFor="condition" className={labelClass}>
              Condition
            </label>
            <select id="condition" defaultValue="" {...register("condition")} className={fieldClass}>
              <option value="" disabled>
                Choose one
              </option>
              {CONDITIONS.map((condition) => (
                <option key={condition} value={condition} className="bg-black">
                  {condition}
                </option>
              ))}
            </select>
            {errors.condition && <p className={errorClass}>{errors.condition.message}</p>}
          </div>
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
        {isSubmitting ? "Publishing…" : "Publish listing"}
      </button>
    </form>
  );
}
