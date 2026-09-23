# Thr-Fit — Website Project Handover

**Project:** Thr-Fit Fashion Marketplace Platform  
**Developer:** Praisel.dev Limited  
**Client:** Rachel  
**Stage:** Stage 3 — Website Development (Payment 2 of 3)  
**Handover Date:** May 2026

---

## Project Overview

Thr-Fit is a fashion resale and collaboration platform built with Next.js (App Router), Tailwind CSS, and Firebase. The platform is designed to allow users to discover outfits, list fashion items for sale, and collaborate on styling ideas.

---

## What Has Been Built

### Foundation & Infrastructure
- Next.js 15 (App Router) project fully initialised and configured
- Firebase project (`thr-fit-marketplace`) set up with the following services:
  - **Firebase Auth** — authentication service initialised and connected
  - **Firestore** — database configured and connected
  - **Firebase Storage** — file/photo storage configured and connected
- Custom branding fonts integrated (Yeseva One + Roboto via Google Fonts)
- Global layout with branded full-screen background video (`golden-brown-moving-bg.mp4`)
- Dark overlay system for readability
- Tailwind CSS configured with custom font variables
- TypeScript configured throughout

### Landing Page (`/`)
- Fully designed and branded Hero section
  - Custom headline typography: *"Thr-fited. Reimagined."*
  - Subtitle copy and two CTA buttons: *Browse Marketplace* and *Start Selling*
- Featured Listings section with product card grid layout
  - Listing cards with title, price, condition tag, and image areas
  - "View all" link to marketplace
- Categories section with filterable fashion category links (Hoodies, Jackets, Vintage, Streetwear, Shoes, Accessories, Women, Men)
- Sell CTA banner with link to listing creation flow

### Components Built
| Component | Description |
|---|---|
| `Hero.tsx` | Branded full-screen hero with CTA buttons |
| `FeaturedListings.tsx` | Product grid with listing cards |
| `Categories.tsx` | Category filter row + seller CTA |
| `ListingCard.tsx` | Reusable card component for marketplace items |
| `BackgroundVideo.tsx` | Full-screen looping background video |

### Backend / Data Layer
| File | Description |
|---|---|
| `firebase.ts` | Firebase app initialisation (Auth, Firestore, Storage) |
| `lib/listings.ts` | `createListing()` function — writes listing data to Firestore |
| `lib/storageUploads.ts` | Photo upload utility for Firebase Storage |

### Route Structure
| Route | Status |
|---|---|
| `/` | ✅ Complete — landing page |
| `/marketplace` | 🔄 Route created, UI pending |
| `/create` | 🔄 Route created, UI pending |
| `/dashboard` | 🔄 Route created, UI pending |

---

## What Is Pending (Stages 4–6)

The following items were not completed due to the project being paused. Progress on Stage 3 was halted after the client review meeting, at which the client indicated dissatisfaction with the direction and was asked to complete a design preferences questionnaire to guide further development. **That questionnaire was never returned by the client**, which prevented the project from advancing to the next phase.

Pending items include:

- Marketplace page UI (product browsing, filtering, search)
- Create listing page UI (photo upload, form, submission flow)
- User dashboard UI
- User authentication screens (login / register)
- User profile pages
- SEO metadata configuration
- Mobile responsive refinements

These items fall under Stage 3 (remaining), Stage 4 (App Core Development), Stage 5 (Integration & Admin), and Stage 6 (Testing & Deployment) — none of which were reached due to the project being closed by the client.

---

## Running the Project Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will run at `http://localhost:3000`.

**Note:** A `.env` file is required for Firebase credentials. The Firebase project is `thr-fit-marketplace`. Contact Praisel.dev for environment variable setup if needed.

---

## Technology Stack

| Technology | Purpose |
|---|---|
| Next.js 15 (App Router) | Web framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Firebase Auth | User authentication |
| Firestore | Database |
| Firebase Storage | Media/photo storage |
| Google Fonts | Custom typography |

---

## Notes on Project Closure

This handover represents all website development work completed up to the point the project was paused. The source code, assets, Firebase project configuration, and all work completed are being handed over to the client in accordance with the terms of the development agreement signed between Praisel.dev Limited and the client.

All work delivered remains fully usable and buildable. The Firebase project is live and operational. A developer can continue from this foundation to complete the remaining pages and features.

---

*Handover prepared by Praisel.dev Limited — May 2026*
