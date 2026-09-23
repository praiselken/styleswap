# Thr-Fit

A fashion resale marketplace — browse secondhand pieces, list your own, give clothing a second life.

Built with Next.js 16 (App Router), React 19, Tailwind CSS v4 and Firebase.

> **Background.** Thr-Fit began as a commissioned build that was paused partway
> through. It's being completed here as a portfolio project, so the remaining
> scope and design decisions are my own.

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

The full publish path — anonymous sign-in, photo upload, Firestore write — runs
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

---

## Structure

```
app/
  page.tsx              Landing page
  marketplace/          Browse, filter and search listings
  create/               Create-listing form
  dashboard/            Seller dashboard (not built yet)
  layout.tsx            Shell: fonts, metadata, video background

components/
  Hero, FeaturedListings, Categories    Landing sections
  ListingCard                           Shared by the landing grid and marketplace
  MarketplaceBrowser                    Browsing, filtering and search
  CreateListingForm                     Photo upload + validated listing form
  BackgroundVideo                       Full-screen video with reduced-motion fallback

lib/
  firebase.ts           SDK init, env config, emulator wiring
  listings.ts           Listing types, Firestore reads and writes, filtering
  storageUploads.ts     Validated photo uploads
  auth.ts               Session handling

firestore.rules         Firestore security rules
storage.rules           Storage security rules
```

---

## Notes on a few decisions

**Listings are queried on a single field.** `fetchListings` orders by
`createdAt` alone and narrows status and category in memory, which keeps it
inside Firestore's automatic indexes — no composite index to configure. Past a
few hundred listings those filters should move into `where()` clauses with a
matching index in `firestore.indexes.json`.

**Search runs client-side.** Firestore has no substring matching, so search
filters the fetched page in the browser. Real full-text search means Algolia or
Typesense; that's the upgrade path, not a workaround to keep.

**Sellers are signed in anonymously.** Listings need a stable `sellerId` before
the login screens exist. Linking a credential to an anonymous account preserves
its uid, so listings created now stay attached to their seller once real accounts
land.

**Filters live in the URL.** Category and search are query params, so a filtered
view is shareable and the back button behaves.

**The background video has a way out.** It's a 9MB asset, so it loads behind a
poster frame with `preload="metadata"`, and viewers who ask for reduced motion
get the still image and never download the video at all.

---

## Security rules

[`firestore.rules`](firestore.rules) and [`storage.rules`](storage.rules) are
enforced by the emulator during development:

- The marketplace is readable without an account.
- Sellers write only as themselves, and only into their own storage folder.
- Listing fields are shape-checked server-side, not just in the form.
- Photos are capped at 5MB and limited to JPEG, PNG and WebP.
- Anything unmatched is denied.

Deploy them with `firebase deploy --only firestore:rules,storage`.

---

## Status

| Area | State |
|---|---|
| Landing page | Done |
| Marketplace browsing, filtering, search | Done |
| Create-listing form with photo upload | Done |
| Security rules | Written and verified locally |
| Accounts — login, registration, profiles | Not built |
| Individual listing pages | Not built |
| Seller dashboard | Placeholder |
| Messaging and collaboration | Not built |
| Payments | Not built |

---

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Firebase (Auth, Firestore,
Storage) · react-hook-form · Zod
