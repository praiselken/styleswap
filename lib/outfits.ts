import { collection, doc, getDoc, getDocs, orderBy, query, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

export type Outfit = {
  id: string;
  title: string;
  description: string;
  coverPhoto: string;
  listingIds: string[];
  tags: string[];
  isSample?: boolean;
  createdAt?: Date;
};

function toOutfit(id: string, data: Record<string, unknown>): Outfit {
  const createdAt = data.createdAt;

  return {
    id,
    title: typeof data.title === "string" ? data.title : "Untitled outfit",
    description: typeof data.description === "string" ? data.description : "",
    coverPhoto: typeof data.coverPhoto === "string" ? data.coverPhoto : "",
    listingIds: Array.isArray(data.listingIds) ? data.listingIds.filter((id) => typeof id === "string") : [],
    tags: Array.isArray(data.tags) ? data.tags.filter((tag) => typeof tag === "string") : [],
    isSample: data.isSample === true,
    createdAt: createdAt instanceof Timestamp ? createdAt.toDate() : undefined,
  };
}

/** Curated outfit ideas for the discovery pages — public, admin-written content. */
export async function fetchOutfits(): Promise<Outfit[]> {
  const snapshot = await getDocs(query(collection(db, "outfits"), orderBy("createdAt", "desc")));
  return snapshot.docs.map((doc) => toOutfit(doc.id, doc.data()));
}

export async function fetchOutfit(id: string): Promise<Outfit | null> {
  const snapshot = await getDoc(doc(db, "outfits", id));
  if (!snapshot.exists()) return null;

  return toOutfit(snapshot.id, snapshot.data());
}
