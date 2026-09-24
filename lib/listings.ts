import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit as fbLimit,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export const CATEGORIES = [
  "Hoodies",
  "Jackets",
  "Vintage",
  "Streetwear",
  "Shoes",
  "Accessories",
  "Women",
  "Men",
] as const;

export const CONDITIONS = [
  "New with tags",
  "Like new",
  "Excellent",
  "Good",
  "Well worn",
] as const;

export type ListingStatus = "active" | "sold" | "draft";

export type Listing = {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  size?: string;
  category?: string;
  condition?: string;
  location?: string;
  photos: string[];
  status: ListingStatus;
  createdAt?: Date;
};

export type NewListing = Omit<Listing, "id" | "status" | "createdAt">;

export async function createListing(data: NewListing) {
  return addDoc(collection(db, "listings"), {
    ...data,
    status: "active" satisfies ListingStatus,
    createdAt: Timestamp.now(),
  });
}

function toListing(id: string, data: Record<string, unknown>): Listing {
  const createdAt = data.createdAt;

  return {
    id,
    sellerId: typeof data.sellerId === "string" ? data.sellerId : "",
    title: typeof data.title === "string" ? data.title : "Untitled",
    description: typeof data.description === "string" ? data.description : "",
    price: typeof data.price === "number" ? data.price : 0,
    size: typeof data.size === "string" ? data.size : undefined,
    category: typeof data.category === "string" ? data.category : undefined,
    condition: typeof data.condition === "string" ? data.condition : undefined,
    location: typeof data.location === "string" ? data.location : undefined,
    photos: Array.isArray(data.photos) ? data.photos : [],
    status: (typeof data.status === "string" ? data.status : "active") as ListingStatus,
    createdAt: createdAt instanceof Timestamp ? createdAt.toDate() : undefined,
  };
}

/**
 * Fetches the most recent listings.
 *
 * Deliberately orders on a single field so Firestore's automatic indexes are
 * enough — status and category are narrowed in `filterListings` below. If the
 * catalogue outgrows a single page, move those into `where()` clauses and add
 * the matching composite index in firestore.indexes.json.
 */
export async function fetchListings(max = 60): Promise<Listing[]> {
  const snapshot = await getDocs(
    query(collection(db, "listings"), orderBy("createdAt", "desc"), fbLimit(max))
  );

  return snapshot.docs.map((doc) => toListing(doc.id, doc.data()));
}

export async function fetchListing(id: string): Promise<Listing | null> {
  const snapshot = await getDoc(doc(db, "listings", id));
  if (!snapshot.exists()) return null;

  return toListing(snapshot.id, snapshot.data());
}

export type ListingFilters = {
  category?: string | null;
  search?: string | null;
  sellerId?: string | null;
};

/**
 * Firestore has no substring search, so title/description matching happens here
 * on the page that was already fetched. Swap for Algolia or Typesense if the
 * catalogue ever needs real full-text search.
 */
export function filterListings(listings: Listing[], filters: ListingFilters) {
  const term = filters.search?.trim().toLowerCase();

  return listings.filter((listing) => {
    if (listing.status !== "active") return false;

    if (filters.sellerId && listing.sellerId !== filters.sellerId) return false;

    if (filters.category && listing.category !== filters.category) return false;

    if (term) {
      const haystack = `${listing.title} ${listing.description} ${listing.category ?? ""}`;
      if (!haystack.toLowerCase().includes(term)) return false;
    }

    return true;
  });
}
