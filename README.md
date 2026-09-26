# StyleSwap

A fashion resale marketplace — browse secondhand pieces, list your own, give clothing a second life.

Built with Next.js 16 (App Router), React 19, Tailwind CSS v4 and Firebase.

> **Background.** This began as a commissioned build for a client that paused
> partway through. It's being completed here, under a placeholder name and
> brand, as a portfolio project — the remaining scope and design decisions are
> my own.

---

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your Firebase config
npm run dev
```

The app runs at `http://localhost:3000`.

Firebase config comes from `NEXT_PUBLIC_FIREBASE_*` variables — see
[`.env.example`](.env.example). The values live in the Firebase console under
**Project settings → General → Your apps → SDK setup and configuration**. The app
fails fast with a named error if any are missing, rather than breaking somewhere
further downstream.

### Local development without touching a real project

The full publish path — registration, photo upload, Firestore write — runs
against the local emulator suite, so development never writes to a live Firebase
project.

```bash
npm run emulators     # auth, firestore, storage — UI at http://127.0.0.1:4000
npm run dev:emulator  # dev server pointed at them, in a second terminal
```

The emulator wiring is gated behind `NEXT_PUBLIC_FIREBASE_EMULATORS`, so a plain
`npm run dev` is unaffected.

**Requires a Java runtime** — the Firestore and Storage emulators need one.
`brew install openjdk` is enough; the `emulators` script finds a keg-only
Homebrew install on its own, so no shell configuration is needed.

### Seeding sample data

The marketplace and outfit pages read from Firestore, so a fresh project has
nothing to show until it's seeded. `scripts/seed.ts` writes fictional sellers,
listings and outfits — every document it writes carries `isSample: true` and a
fixed id, so re-running is a no-op rather than a pile of duplicates.

Against the emulator (no credentials needed):

```bash
npm run emulators                                          # in one terminal
FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 npm run seed         # in another
FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 npm run seed:clear   # to remove it again
```

Against a live project, the script writes with the Firebase Admin SDK, so it
needs a service account key — **never commit one**:

```bash
export GOOGLE_APPLICATION_CREDENTIALS=/path/outside/the/repo/service-account.json
npm run seed
npm run seed:clear
```

`.gitignore` already excludes `/secrets/` and any `*serviceAccount*.json` /
`*service-account*.json` path, so a key kept in `secrets/` at the repo root
never gets staged by accident — but the safest place for it is still outside
the repo entirely.

---

## Scripts

| Script | Does |
|---|---|
| `npm run dev` | Dev server against the configured Firebase project |
| `npm run dev:emulator` | Dev server against the local emulator suite |
| `npm run emulators` | Start auth, Firestore and Storage emulators |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run seed` | Write sample sellers, listings and outfits to Firestore |
| `npm run seed:clear` | Delete every document with `isSample == true` |

---

## Structure

```
app/
  page.tsx              Landing page
  marketplace/          Browse, filter, sort and search listings
  listing/[id]/         Individual listing page
  outfits/               Outfit discovery grid, with a tag filter
  outfits/[id]/          Individual outfit page — cover, description, "shop the look"
  create/               Create-listing form (requires a registered account)
  login/, register/     Email/password auth, honour ?redirect= back to where you started
  profile/[uid]/        Public seller profile and their active listings
  profile/edit/         Edit your own profile (requires a registered account)
  saved/                Favorited listings (requires a registered account)
  dashboard/            Signed-in home (requires a registered account)
  layout.tsx            Shell: fonts, metadata, video background, header, footer

components/
  Hero, FeaturedListings, Categories, InstagramFeed    Landing sections
  ListingCard                           Shared by the landing grid, marketplace, saved, profile and outfits
  MarketplaceBrowser                    Browsing, filtering, sorting and search
  OutfitsBrowser, OutfitDetail          Outfit discovery grid and individual outfit page
  ListingDetail                         Individual listing page, incl. "more from this seller"
  CreateListingForm                     Photo upload + validated listing form
  LoginForm, RegisterForm               Auth forms
  Header                                Site nav, auth-aware
  Dashboard                             Signed-in home
  ProfileView, EditProfileForm          Public profile and its editor
  SavedListings                         Favorited listings
  StarRating                            Mock seller rating display
  BackgroundVideo                       Full-screen video with reduced-motion fallback

lib/
  firebase.ts           SDK init, env config, emulator wiring
  listings.ts           Listing types, Firestore reads/writes, filtering, sorting, featured query
  outfits.ts             Outfit type and Firestore reads
  storageUploads.ts     Validated photo uploads
  auth.ts               Registration, login, session handling
  users.ts              Profile reads and writes
  favorites.ts           Favorite reads and writes
  mockRating.ts          Deterministic cosmetic seller rating (no real reviews yet)
  useAuthUser.ts         Hook exposing the signed-in user
  useRequireAuth.ts      Redirects a signed-out visitor to /login?redirect=<path>
  useFavorites.ts        Hook exposing and toggling the signed-in user's favorites

scripts/seed.ts          Sample-data seed script (see "Seeding sample data" above)

firestore.rules          Firestore security rules
firestore.indexes.json   Composite index for the featured-listings query
storage.rules            Storage security rules
```

---

## Notes on a few decisions

**Listings are queried on a single field, except for the featured query.**
`fetchListings` orders by `createdAt` alone and narrows status and category in
memory, which keeps it inside Firestore's automatic indexes. Past a few
hundred listings those filters should move into `where()` clauses with a
matching index. `fetchFeaturedListings` (the landing page's Trending section)
already does this — `featured == true`, `status == 'active'`, ordered by
`createdAt` — and needs the composite index in `firestore.indexes.json`
deployed for it to work.

**Search runs client-side.** Firestore has no substring matching, so search
filters the fetched page in the browser. Real full-text search means Algolia or
Typesense; that's the upgrade path, not a workaround to keep.

**Anonymous posting is not allowed.** Creating a listing, saving a favorite
and editing a profile all require a real, registered account — there's no
anonymous session anymore. Hitting `/create`, `/saved`, `/dashboard` or
`/profile/edit` while signed out redirects to `/login?redirect=<path>` and
sends you back once you sign in, and the rules enforce the same requirement
server-side (`request.auth.token.firebase.sign_in_provider != 'anonymous'`),
not just in the UI.

**Sample data is real Firestore data, not hardcoded arrays.** Every seeded
document — sellers, listings, outfits — carries `isSample: true`, is written
only by `scripts/seed.ts` via the Admin SDK, and shows a small "Sample" badge
in the UI. `featured` and `isSample` are both admin-only fields the security
rules never let a client set or change.

**Filters live in the URL.** Category and search are query params, so a filtered
view is shareable and the back button behaves.

**The background video has a way out.** It's a 9MB asset, so it loads behind a
poster frame with `preload="metadata"`, and viewers who ask for reduced motion
get the still image and never download the video at all.

**Seller ratings are cosmetic.** There's no transaction history to rate
sellers on yet, so `mockRatingFor` derives a stable-looking star rating and
review count from the seller's uid — same uid always yields the same
numbers, rather than a random one that would flicker on every load. It's
isolated to one function specifically so it's easy to delete once real
reviews exist.

**The Instagram feed is a static grid, not a real integration.** The photos
are hand-picked from Pexels (free license, no attribution required) and
hardcoded — no API key ships with the app.

---

## Security rules

[`firestore.rules`](firestore.rules) and [`storage.rules`](storage.rules) are
enforced by the emulator during development:

- The marketplace, profiles and outfits are readable without an account.
- Only a real, registered account — never an anonymous session — can create
  or edit a listing, save a favorite, or edit a profile, and only as
  themselves. Sellers write photos only into their own storage folder.
- Listing `update` re-applies the same field validation as `create` (title,
  description, price, photos, a `status` enum), keeps `sellerId` immutable,
  and rejects any client attempt to set or change `featured` or `isSample` —
  those are admin-only, written only by `scripts/seed.ts`.
- Favorites are readable and writable only by the account that owns them —
  enforced by the doc id itself, which pins each one to a single (user,
  listing) pair.
- Outfits are public read, no client writes at all.
- Photos are capped at 5MB and limited to JPEG, PNG and WebP.
- Anything unmatched is denied.

There's no emulator rules-test harness in this repo; the checks above were
verified manually against the emulator (anonymous create denied, a negative
price on `update` denied, a client-set `featured: true` denied) — see the
commit that introduced them for the exact requests used.

Deploy them, together with the composite index the featured-listings query
needs, with:

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage
```

---

## Status

| Area | State |
|---|---|
| Landing page | Done — Trending section reads real featured listings from Firestore |
| Marketplace browsing, filtering, search | Done |
| Outfit discovery (`/outfits`, `/outfits/[id]`) | Done |
| Create-listing form with photo upload | Done — requires a registered account |
| Accounts — login, registration | Done — no anonymous posting |
| User profiles — view and edit | Done |
| Individual listing pages | Done |
| Favorites / saved items | Done |
| Sort and price-range filtering, brand field | Done |
| Sample data (sellers, listings, outfits) | Seeded via `scripts/seed.ts`, labeled in the UI |
| Seller ratings | Cosmetic — mocked, no real reviews yet |
| "More from this seller" bundle nudge | Done |
| Instagram feed on the landing page | Done — static grid, not a real integration |
| Security rules | Written and manually verified against the emulator |
| Messaging and collaboration | Not built |
| Payments | Not built |

---

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Firebase (Auth, Firestore,
Storage) · react-hook-form · Zod
