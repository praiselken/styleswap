import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

export type UserProfile = {
  uid: string;
  displayName: string;
  bio?: string;
  location?: string;
  createdAt?: Date;
};

/** Creates the profile doc for a new account. A no-op if one already exists. */
export async function ensureUserProfile(uid: string, displayName: string): Promise<void> {
  const ref = doc(db, "users", uid);
  const snapshot = await getDoc(ref);
  if (snapshot.exists()) return;

  await setDoc(ref, { displayName, createdAt: Timestamp.now() });
}

export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  const snapshot = await getDoc(doc(db, "users", uid));
  if (!snapshot.exists()) return null;

  const data = snapshot.data();
  return {
    uid,
    displayName: data.displayName ?? "StyleSwap member",
    bio: data.bio || undefined,
    location: data.location || undefined,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : undefined,
  };
}

export type ProfileEdits = {
  displayName: string;
  bio?: string;
  location?: string;
};

export async function updateUserProfile(uid: string, edits: ProfileEdits): Promise<void> {
  await setDoc(
    doc(db, "users", uid),
    {
      displayName: edits.displayName,
      bio: edits.bio ?? "",
      location: edits.location ?? "",
    },
    { merge: true }
  );
}
