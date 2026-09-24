/**
 * Deterministic, cosmetic seller rating derived from a uid.
 *
 * There's no real transaction history to rate sellers on in this demo, so
 * this stands in for it — same uid always yields the same rating, rather
 * than a random one that would flicker between renders or page loads.
 * Delete this once real reviews exist.
 */
export function mockRatingFor(uid: string): { rating: number; reviewCount: number } {
  let hash = 0;
  for (let i = 0; i < uid.length; i++) {
    hash = (hash * 31 + uid.charCodeAt(i)) >>> 0;
  }

  const rating = Math.round((4.2 + (hash % 9) / 10) * 10) / 10; // 4.2–5.0
  const reviewCount = 3 + (hash % 118); // 3–120

  return { rating, reviewCount };
}
