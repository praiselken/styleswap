"use client";

import { useEffect, useState } from "react";
import { fetchFavoriteIds, setFavorite } from "./favorites";
import { useAuthUser } from "./useAuthUser";

/** Tracks the signed-in user's favorited listing ids and toggles them optimistically. */
export function useFavorites() {
  const { user } = useAuthUser();
  const uid = user?.uid ?? null;
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  // Clear the previous user's favorites the moment the signed-in uid changes,
  // during render rather than in the effect below — otherwise a sign-out or
  // account switch would flash the old user's hearts until the fetch settles.
  const [loadedUid, setLoadedUid] = useState(uid);
  if (uid !== loadedUid) {
    setLoadedUid(uid);
    setFavoriteIds(new Set());
  }

  useEffect(() => {
    if (!user) return;

    fetchFavoriteIds(user.uid)
      .then(setFavoriteIds)
      .catch((error) => console.error("Failed to load favorites", error));
  }, [user]);

  function toggleFavorite(listingId: string) {
    if (!user) return;

    const wasFavorited = favoriteIds.has(listingId);
    const next = new Set(favoriteIds);
    if (wasFavorited) next.delete(listingId);
    else next.add(listingId);
    setFavoriteIds(next);

    setFavorite(user.uid, listingId, !wasFavorited).catch((error) => {
      console.error("Failed to update favorite", error);
      setFavoriteIds(favoriteIds);
    });
  }

  return { user, favoriteIds, toggleFavorite };
}
