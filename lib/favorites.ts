import { collection, deleteDoc, doc, getDocs, query, setDoc, Timestamp, where } from "firebase/firestore";
import { db } from "./firebase";

function favoriteId(uid: string, listingId: string) {
  return `${uid}_${listingId}`;
}

export async function fetchFavoriteIds(uid: string): Promise<Set<string>> {
  const snapshot = await getDocs(query(collection(db, "favorites"), where("userId", "==", uid)));
  return new Set(snapshot.docs.map((d) => d.data().listingId as string));
}

export async function setFavorite(uid: string, listingId: string, favorited: boolean): Promise<void> {
  const ref = doc(db, "favorites", favoriteId(uid, listingId));

  if (favorited) {
    await setDoc(ref, { userId: uid, listingId, createdAt: Timestamp.now() });
  } else {
    await deleteDoc(ref);
  }
}
