import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";

export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

function safeName(name: string) {
  return name.replace(/[^a-zA-Z0-9.\-_]/g, "-");
}

/** Uploads one listing photo and returns its public download URL. */
export async function uploadListingPhoto(sellerId: string, file: File) {
  if (!ACCEPTED.includes(file.type)) {
    throw new Error(`${file.name}: only JPEG, PNG and WebP images are accepted.`);
  }
  if (file.size > MAX_PHOTO_BYTES) {
    throw new Error(`${file.name} is larger than 5MB.`);
  }

  const path = `listings/${sellerId}/${Date.now()}-${safeName(file.name)}`;
  const snapshot = await uploadBytes(ref(storage, path), file);
  return getDownloadURL(snapshot.ref);
}

export async function uploadListingPhotos(sellerId: string, files: File[]) {
  return Promise.all(files.map((file) => uploadListingPhoto(sellerId, file)));
}
