/**
 * Seeds (or clears) sample marketplace data so the demo has something to
 * show. Every document this script writes carries `isSample: true`, has a
 * fixed doc id, and is written with a fixed `createdAt` — re-running `seed`
 * is a no-op beyond overwriting the same docs with the same values, and
 * `seed:clear` removes every doc where `isSample == true` across every
 * collection this script touches, leaving real user data untouched.
 *
 * Targeting:
 * - If FIRESTORE_EMULATOR_HOST is set, writes go to the emulator and no
 *   credentials are needed.
 * - Otherwise, set GOOGLE_APPLICATION_CREDENTIALS to the path of a service
 *   account JSON key for the target Firebase project. That path must live
 *   outside the repo, or under a gitignored path such as /secrets — never
 *   commit it.
 *
 * Usage:
 *   npm run seed          # write sample data
 *   npm run seed:clear    # delete every isSample doc
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp, type WriteBatch } from "firebase-admin/firestore";

const __dirname = dirname(fileURLToPath(import.meta.url));

function projectId(): string {
  if (process.env.FIREBASE_PROJECT_ID) return process.env.FIREBASE_PROJECT_ID;

  const rc = JSON.parse(readFileSync(join(__dirname, "..", ".firebaserc"), "utf8"));
  const id = rc?.projects?.default;
  if (!id) throw new Error("Couldn't determine a project id — set FIREBASE_PROJECT_ID.");
  return id;
}

function initAdmin() {
  if (getApps().length) return getApps()[0];

  const project = projectId();

  if (process.env.FIRESTORE_EMULATOR_HOST) {
    console.log(`Targeting the Firestore emulator at ${process.env.FIRESTORE_EMULATOR_HOST} (project: ${project}).`);
    return initializeApp({ projectId: project });
  }

  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!credPath) {
    throw new Error(
      "Set GOOGLE_APPLICATION_CREDENTIALS to a service-account JSON file (outside the repo, or under a " +
        "gitignored path like /secrets), or set FIRESTORE_EMULATOR_HOST to target the emulator instead."
    );
  }

  console.log(`Targeting the live project "${project}" with credentials from ${credPath}.`);
  const serviceAccount = JSON.parse(readFileSync(credPath, "utf8"));
  return initializeApp({
    credential: cert(serviceAccount),
    projectId: project,
  });
}

const app = initAdmin();
const db = getFirestore(app);

// Fixed reference point so every run produces byte-identical timestamps —
// idempotency isn't just "no duplicates," it's "no drift" either.
const SEED_BASE = new Date("2026-09-25T12:00:00Z").getTime();
const DAY = 24 * 60 * 60 * 1000;
function daysAgo(n: number) {
  return Timestamp.fromMillis(SEED_BASE - n * DAY);
}

type SellerSeed = {
  id: string;
  displayName: string;
  bio: string;
  location: string;
  daysAgo: number;
};

const SELLERS: SellerSeed[] = [
  {
    id: "sample_seller_amelia",
    displayName: "Amelia Foster",
    bio: "Clears out her wardrobe every season — mostly knitwear and dresses she can't bear to keep past one wear.",
    location: "Bristol, UK",
    daysAgo: 120,
  },
  {
    id: "sample_seller_jamal",
    displayName: "Jamal Whitfield",
    bio: "Streetwear and trainers collector, selling off pairs to fund the next one.",
    location: "Manchester, UK",
    daysAgo: 95,
  },
  {
    id: "sample_seller_priya",
    displayName: "Priya Anand",
    bio: "Sews her own alterations and sells what no longer fits her rotation.",
    location: "Leeds, UK",
    daysAgo: 200,
  },
  {
    id: "sample_seller_connor",
    displayName: "Connor Doyle",
    bio: "Outdoor and workwear pieces, all worn in and ready for someone else's winter.",
    location: "Glasgow, UK",
    daysAgo: 60,
  },
  {
    id: "sample_seller_freya",
    displayName: "Freya Nilsson",
    bio: "Charity shop finds she's re-homing after a wardrobe declutter.",
    location: "Brighton, UK",
    daysAgo: 150,
  },
  {
    id: "sample_seller_tobias",
    displayName: "Tobias Reed",
    bio: "Selling a few well-loved pieces between house moves.",
    location: "Birmingham, UK",
    daysAgo: 80,
  },
];

type ListingSeed = {
  id: string;
  title: string;
  description: string;
  price: number;
  brand: string;
  size?: string;
  category: string;
  condition: string;
  sellerId: string;
  photos: string[]; // credit: see PHOTO_CREDITS below
  status: "active" | "sold";
  featured?: boolean;
  daysAgo: number;
};

/**
 * Photographer credits (Pexels, free license, no attribution required —
 * kept anyway as a courtesy). Keyed by photo URL.
 */
const PHOTO_CREDITS: Record<string, string> = {
  "https://images.pexels.com/photos/10906262/pexels-photo-10906262.jpeg?auto=compress&cs=tinysrgb&h=650&w=940":
    "moroccophobia",
  "https://images.pexels.com/photos/3524916/pexels-photo-3524916.jpeg?auto=compress&cs=tinysrgb&h=650&w=940":
    "Jonathon Burton",
  "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&h=650&w=940": "Mnz",
  "https://images.pexels.com/photos/14663219/pexels-photo-14663219.jpeg?auto=compress&cs=tinysrgb&h=650&w=940":
    "Rodrigo Arrosquipa",
  "https://images.pexels.com/photos/9902629/pexels-photo-9902629.jpeg?auto=compress&cs=tinysrgb&h=650&w=940":
    "armağan .",
  "https://images.pexels.com/photos/12194934/pexels-photo-12194934.jpeg?auto=compress&cs=tinysrgb&h=650&w=940":
    "Tarek Shahin",
  "https://images.pexels.com/photos/11340657/pexels-photo-11340657.jpeg?auto=compress&cs=tinysrgb&h=650&w=940":
    "Noé Villalta Photography",
  "https://images.pexels.com/photos/7236120/pexels-photo-7236120.jpeg?auto=compress&cs=tinysrgb&h=650&w=940":
    "cottonbro studio",
  "https://images.pexels.com/photos/35145903/pexels-photo-35145903.jpeg?auto=compress&cs=tinysrgb&h=650&w=940":
    "Anton Nekhaychik_PHTGRPH",
  "https://images.pexels.com/photos/32836908/pexels-photo-32836908.jpeg?auto=compress&cs=tinysrgb&h=650&w=940":
    "César O'neill",
  "https://images.pexels.com/photos/9936328/pexels-photo-9936328.jpeg?auto=compress&cs=tinysrgb&h=650&w=940":
    "El gringo photo",
  "https://images.pexels.com/photos/26760669/pexels-photo-26760669.jpeg?auto=compress&cs=tinysrgb&h=650&w=940":
    "Brian Jiz",
  "https://images.pexels.com/photos/7920188/pexels-photo-7920188.jpeg?auto=compress&cs=tinysrgb&h=650&w=940":
    "Sakshi Patwa",
  "https://images.pexels.com/photos/16891088/pexels-photo-16891088.jpeg?auto=compress&cs=tinysrgb&h=650&w=940":
    "Mario Vásquez Rioja",
  "https://images.pexels.com/photos/14082367/pexels-photo-14082367.jpeg?auto=compress&cs=tinysrgb&h=650&w=940":
    "Helena Jankovičová Kováčová",
  "https://images.pexels.com/photos/13569179/pexels-photo-13569179.jpeg?auto=compress&cs=tinysrgb&h=650&w=940":
    "Daniil Kondrashin",
  "https://images.pexels.com/photos/12210270/pexels-photo-12210270.jpeg?auto=compress&cs=tinysrgb&h=650&w=940":
    "Euwan Marbaniang",
  "https://images.pexels.com/photos/14187813/pexels-photo-14187813.jpeg?auto=compress&cs=tinysrgb&h=650&w=940":
    "Rumeysa Demir",
  "https://images.pexels.com/photos/36581188/pexels-photo-36581188.jpeg?auto=compress&cs=tinysrgb&h=650&w=940":
    "Valentin Ivantsov",
  "https://images.pexels.com/photos/7893079/pexels-photo-7893079.jpeg?auto=compress&cs=tinysrgb&h=650&w=940":
    "Jaime Reimer",
  "https://images.pexels.com/photos/5352628/pexels-photo-5352628.jpeg?auto=compress&cs=tinysrgb&h=650&w=940":
    "Nataliya Vaitkevich",
  "https://images.pexels.com/photos/33271779/pexels-photo-33271779.jpeg?auto=compress&cs=tinysrgb&h=650&w=940":
    "Mert Coşkun",
  "https://images.pexels.com/photos/19231623/pexels-photo-19231623.jpeg?auto=compress&cs=tinysrgb&h=650&w=940":
    "Anya Juárez Tenorio",
  "https://images.pexels.com/photos/36311379/pexels-photo-36311379.jpeg?auto=compress&cs=tinysrgb&h=650&w=940":
    "Souhityo Das",
  "https://images.pexels.com/photos/12975963/pexels-photo-12975963.jpeg?auto=compress&cs=tinysrgb&h=650&w=940":
    "Mohammed Harshil",
  "https://images.pexels.com/photos/8217483/pexels-photo-8217483.jpeg?auto=compress&cs=tinysrgb&h=650&w=940":
    "MART PRODUCTION",
};

const PHOTO = {
  hoodieMan: "https://images.pexels.com/photos/10906262/pexels-photo-10906262.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  choreJacket: "https://images.pexels.com/photos/3524916/pexels-photo-3524916.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  straightJeans: "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  pufferCoat: "https://images.pexels.com/photos/14663219/pexels-photo-14663219.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  graphicTees: "https://images.pexels.com/photos/9902629/pexels-photo-9902629.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  topHandleBag: "https://images.pexels.com/photos/12194934/pexels-photo-12194934.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  grayHoodie: "https://images.pexels.com/photos/11340657/pexels-photo-11340657.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  friendsHoodies: "https://images.pexels.com/photos/7236120/pexels-photo-7236120.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  leatherJacket: "https://images.pexels.com/photos/35145903/pexels-photo-35145903.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  leatherJacketNight: "https://images.pexels.com/photos/32836908/pexels-photo-32836908.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  laceDress: "https://images.pexels.com/photos/9936328/pexels-photo-9936328.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  sundress: "https://images.pexels.com/photos/26760669/pexels-photo-26760669.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  wrapDress: "https://images.pexels.com/photos/7920188/pexels-photo-7920188.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  clothesRack: "https://images.pexels.com/photos/16891088/pexels-photo-16891088.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  mannequins: "https://images.pexels.com/photos/14082367/pexels-photo-14082367.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  outdoorPortrait: "https://images.pexels.com/photos/13569179/pexels-photo-13569179.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  elegantShoes: "https://images.pexels.com/photos/12210270/pexels-photo-12210270.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  slippers: "https://images.pexels.com/photos/14187813/pexels-photo-14187813.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  sandals: "https://images.pexels.com/photos/36581188/pexels-photo-36581188.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  backpack: "https://images.pexels.com/photos/7893079/pexels-photo-7893079.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  handbag: "https://images.pexels.com/photos/5352628/pexels-photo-5352628.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  streetPortrait: "https://images.pexels.com/photos/33271779/pexels-photo-33271779.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  flowerCrown: "https://images.pexels.com/photos/19231623/pexels-photo-19231623.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  pinkKurti: "https://images.pexels.com/photos/36311379/pexels-photo-36311379.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  menOnBench: "https://images.pexels.com/photos/12975963/pexels-photo-12975963.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  whiteShirt: "https://images.pexels.com/photos/8217483/pexels-photo-8217483.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
} as const;

const LISTINGS: ListingSeed[] = [
  // Featured — reuse the six photos that used to be hardcoded in
  // FeaturedListings.tsx, so the landing page keeps its current look.
  {
    id: "sample_listing_01",
    title: "Cropped Zip Hoodie",
    description:
      "Soft cotton-blend zip hoodie in a relaxed crop cut. Worn a handful of times, no bobbling or fading.",
    price: 25,
    brand: "Independent label",
    size: "M",
    category: "Hoodies",
    condition: "Excellent",
    sellerId: "sample_seller_amelia",
    photos: [PHOTO.hoodieMan],
    status: "active",
    featured: true,
    daysAgo: 2,
  },
  {
    id: "sample_listing_02",
    title: "Utility Chore Jacket",
    description:
      "Sturdy canvas chore jacket with brass buttons and two chest pockets. Some honest wear at the cuffs.",
    price: 45,
    brand: "Workwear reissue",
    size: "L",
    category: "Jackets",
    condition: "Good",
    sellerId: "sample_seller_connor",
    photos: [PHOTO.choreJacket],
    status: "active",
    featured: true,
    daysAgo: 5,
  },
  {
    id: "sample_listing_03",
    title: "Classic Straight-Leg Jeans",
    description: "Faded straight-leg denim with a proper vintage wash. True to size, no rips.",
    price: 22,
    brand: "Vintage",
    size: "W32 L32",
    category: "Vintage",
    condition: "Good",
    sellerId: "sample_seller_tobias",
    photos: [PHOTO.straightJeans],
    status: "active",
    featured: true,
    daysAgo: 8,
  },
  {
    id: "sample_listing_04",
    title: "Technical Puffer Coat",
    description: "Lightweight technical puffer, packs down small. Zips and poppers all working.",
    price: 35,
    brand: "Outdoor label",
    size: "M",
    category: "Jackets",
    condition: "Excellent",
    sellerId: "sample_seller_freya",
    photos: [PHOTO.pufferCoat],
    status: "active",
    featured: true,
    daysAgo: 1,
  },
  {
    id: "sample_listing_05",
    title: "Graphic Tee Bundle",
    description: "Bundle of three graphic tees, all machine washed and ready to wear.",
    price: 15,
    brand: "Mixed labels",
    size: "M/L",
    category: "Streetwear",
    condition: "Good",
    sellerId: "sample_seller_jamal",
    photos: [PHOTO.graphicTees],
    status: "active",
    featured: true,
    daysAgo: 3,
  },
  {
    id: "sample_listing_06",
    title: "Structured Top-Handle Bag",
    description: "Structured faux-leather top-handle bag with a detachable strap. Minimal signs of use.",
    price: 28,
    brand: "Vintage",
    category: "Accessories",
    condition: "Excellent",
    sellerId: "sample_seller_priya",
    photos: [PHOTO.topHandleBag],
    status: "active",
    featured: true,
    daysAgo: 6,
  },

  // The rest of the catalogue.
  {
    id: "sample_listing_07",
    title: "Oversized Grey Marl Hoodie",
    description: "Heavyweight grey marl hoodie, oversized fit. Barely worn, kept folded in a drawer.",
    price: 22,
    brand: "Unbranded",
    size: "L",
    category: "Hoodies",
    condition: "Like new",
    sellerId: "sample_seller_amelia",
    photos: [PHOTO.grayHoodie],
    status: "active",
    daysAgo: 4,
  },
  {
    id: "sample_listing_08",
    title: "Two-Tone Pullover Hoodie",
    description: "Colour-block pullover hoodie, soft fleece lining. A couple of light bobbles from wash.",
    price: 19,
    brand: "No label",
    size: "M",
    category: "Hoodies",
    condition: "Good",
    sellerId: "sample_seller_jamal",
    photos: [PHOTO.friendsHoodies],
    status: "active",
    daysAgo: 12,
  },
  {
    id: "sample_listing_09",
    title: "Faux Leather Biker Jacket",
    description: "Fitted faux leather biker jacket with silver hardware. Worn twice, dry cleaned.",
    price: 48,
    brand: "Vintage reissue",
    size: "S",
    category: "Jackets",
    condition: "Excellent",
    sellerId: "sample_seller_connor",
    photos: [PHOTO.leatherJacket],
    status: "active",
    daysAgo: 7,
  },
  {
    id: "sample_listing_10",
    title: "Cropped Moto Jacket",
    description: "Cropped moto jacket in soft faux leather. Buyer collected in person.",
    price: 52,
    brand: "Boutique find",
    size: "M",
    category: "Jackets",
    condition: "Like new",
    sellerId: "sample_seller_freya",
    photos: [PHOTO.leatherJacketNight],
    status: "sold",
    daysAgo: 15,
  },
  {
    id: "sample_listing_11",
    title: "Lace Trim Slip Dress",
    description: "Bias-cut slip dress with lace trim, true vintage cut. Hand wash only.",
    price: 30,
    brand: "Vintage",
    size: "S",
    category: "Vintage",
    condition: "Excellent",
    sellerId: "sample_seller_priya",
    photos: [PHOTO.laceDress],
    status: "active",
    daysAgo: 9,
  },
  {
    id: "sample_listing_12",
    title: "Retro Sundress",
    description: "Cotton sundress with a retro print, elastic waist. Plenty of wear left in it yet.",
    price: 24,
    brand: "Vintage",
    size: "M",
    category: "Vintage",
    condition: "Well worn",
    sellerId: "sample_seller_tobias",
    photos: [PHOTO.sundress],
    status: "active",
    daysAgo: 18,
  },
  {
    id: "sample_listing_13",
    title: "Embroidered Wrap Dress",
    description: "Hand-embroidered wrap dress, adjustable tie waist. Worn once for a wedding.",
    price: 35,
    brand: "Handmade",
    size: "M",
    category: "Vintage",
    condition: "Like new",
    sellerId: "sample_seller_amelia",
    photos: [PHOTO.wrapDress],
    status: "active",
    daysAgo: 3,
  },
  {
    id: "sample_listing_14",
    title: "Boxy Graphic Tee",
    description: "Boxy fit tee with a screen-printed graphic. Soft cotton, held up well after washing.",
    price: 14,
    brand: "Independent label",
    size: "L",
    category: "Streetwear",
    condition: "Good",
    sellerId: "sample_seller_jamal",
    photos: [PHOTO.clothesRack],
    status: "active",
    daysAgo: 11,
  },
  {
    id: "sample_listing_15",
    title: "Cargo Utility Pants",
    description: "Six-pocket cargo pants in ripstop cotton. Never worn, tags still on.",
    price: 26,
    brand: "Workwear reissue",
    size: "32",
    category: "Streetwear",
    condition: "New with tags",
    sellerId: "sample_seller_connor",
    photos: [PHOTO.mannequins],
    status: "active",
    daysAgo: 6,
  },
  {
    id: "sample_listing_16",
    title: "Logo-Free Track Jacket",
    description: "Zip-through track jacket with contrast piping, no branding. Worn a couple of times.",
    price: 20,
    brand: "Unbranded",
    size: "M",
    category: "Streetwear",
    condition: "Like new",
    sellerId: "sample_seller_freya",
    photos: [PHOTO.outdoorPortrait],
    status: "active",
    daysAgo: 2,
  },
  {
    id: "sample_listing_17",
    title: "Leather Court Shoes",
    description: "Pointed leather court shoes, low block heel. Soles show light wear, uppers pristine.",
    price: 32,
    brand: "Vintage",
    size: "UK6",
    category: "Shoes",
    condition: "Excellent",
    sellerId: "sample_seller_priya",
    photos: [PHOTO.elegantShoes],
    status: "active",
    daysAgo: 14,
  },
  {
    id: "sample_listing_18",
    title: "Everyday Canvas Slip-Ons",
    description: "Canvas slip-on trainers, machine washable. Sold within a day of listing.",
    price: 16,
    brand: "No label",
    size: "UK8",
    category: "Shoes",
    condition: "Good",
    sellerId: "sample_seller_tobias",
    photos: [PHOTO.slippers],
    status: "sold",
    daysAgo: 20,
  },
  {
    id: "sample_listing_19",
    title: "Heeled Strappy Sandals",
    description: "Strappy block-heel sandals in tan leather. Worn once to a summer wedding.",
    price: 28,
    brand: "Boutique find",
    size: "UK5",
    category: "Shoes",
    condition: "Like new",
    sellerId: "sample_seller_amelia",
    photos: [PHOTO.sandals],
    status: "active",
    daysAgo: 5,
  },
  {
    id: "sample_listing_20",
    title: "Classic Chelsea Boots",
    description: "Pull-on Chelsea boots in brown leather. Resoled once, plenty of life left.",
    price: 45,
    brand: "Vintage reissue",
    size: "UK9",
    category: "Shoes",
    condition: "Excellent",
    sellerId: "sample_seller_jamal",
    photos: [PHOTO.elegantShoes],
    status: "active",
    daysAgo: 10,
  },
  {
    id: "sample_listing_21",
    title: "Canvas Backpack",
    description: "Everyday canvas backpack with a laptop sleeve. Minor scuffing on the base.",
    price: 18,
    brand: "Unbranded",
    category: "Accessories",
    condition: "Good",
    sellerId: "sample_seller_connor",
    photos: [PHOTO.backpack],
    status: "active",
    daysAgo: 13,
  },
  {
    id: "sample_listing_22",
    title: "Structured Shoulder Bag",
    description: "Structured shoulder bag in mustard suede. Adjustable strap, one small mark inside.",
    price: 22,
    brand: "Vintage",
    category: "Accessories",
    condition: "Excellent",
    sellerId: "sample_seller_freya",
    photos: [PHOTO.handbag],
    status: "active",
    daysAgo: 4,
  },
  {
    id: "sample_listing_23",
    title: "Floral Wrap Skirt",
    description: "Midi wrap skirt in a floral print, adjustable tie. Worn twice.",
    price: 20,
    brand: "Independent label",
    size: "10",
    category: "Women",
    condition: "Excellent",
    sellerId: "sample_seller_priya",
    photos: [PHOTO.streetPortrait],
    status: "active",
    daysAgo: 1,
  },
  {
    id: "sample_listing_24",
    title: "Knit Midi Dress",
    description: "Ribbed knit midi dress, roll neck. Sold to a buyer nearby.",
    price: 26,
    brand: "Handmade",
    size: "12",
    category: "Women",
    condition: "Like new",
    sellerId: "sample_seller_tobias",
    photos: [PHOTO.flowerCrown],
    status: "sold",
    daysAgo: 16,
  },
  {
    id: "sample_listing_25",
    title: "Printed Kurti Top",
    description: "Printed cotton kurti top, three-quarter sleeves. Light wear from regular use.",
    price: 15,
    brand: "Vintage",
    size: "M",
    category: "Women",
    condition: "Good",
    sellerId: "sample_seller_amelia",
    photos: [PHOTO.pinkKurti],
    status: "active",
    daysAgo: 17,
  },
  {
    id: "sample_listing_26",
    title: "Classic Oxford Shirt",
    description: "Crisp cotton Oxford shirt, button-down collar. Pressed and ready to wear.",
    price: 18,
    brand: "No label",
    size: "15.5",
    category: "Men",
    condition: "Excellent",
    sellerId: "sample_seller_jamal",
    photos: [PHOTO.menOnBench],
    status: "active",
    daysAgo: 9,
  },
  {
    id: "sample_listing_27",
    title: "Relaxed Chino Trousers",
    description: "Relaxed-fit chinos in stone. A little fading at the knee from wear.",
    price: 24,
    brand: "Unbranded",
    size: "32",
    category: "Men",
    condition: "Good",
    sellerId: "sample_seller_connor",
    photos: [PHOTO.whiteShirt],
    status: "active",
    daysAgo: 19,
  },
];

type OutfitSeed = {
  id: string;
  title: string;
  description: string;
  coverPhoto: string;
  tags: string[];
  listingIds: string[];
  daysAgo: number;
};

const OUTFITS: OutfitSeed[] = [
  {
    id: "sample_outfit_weekend_streetwear",
    title: "Weekend Streetwear Edit",
    description: "Easy weekend layers — a relaxed hoodie, cargo pants and slip-on trainers, backpack included.",
    coverPhoto: PHOTO.grayHoodie,
    tags: ["Weekend", "Streetwear"],
    listingIds: ["sample_listing_07", "sample_listing_15", "sample_listing_18", "sample_listing_21"],
    daysAgo: 2,
  },
  {
    id: "sample_outfit_smart_workwear",
    title: "Smart Workwear",
    description: "A tidy office-to-evening fit — Oxford shirt, chinos, court shoes and a structured bag.",
    coverPhoto: PHOTO.menOnBench,
    tags: ["Workwear"],
    listingIds: ["sample_listing_26", "sample_listing_27", "sample_listing_17", "sample_listing_22"],
    daysAgo: 6,
  },
  {
    id: "sample_outfit_night_out",
    title: "Night Out Edit",
    description: "Slip dress, strappy heels and a compact bag — ready for a night out.",
    coverPhoto: PHOTO.laceDress,
    tags: ["Night out"],
    listingIds: ["sample_listing_11", "sample_listing_19", "sample_listing_22"],
    daysAgo: 4,
  },
  {
    id: "sample_outfit_vintage_denim_day",
    title: "Vintage Denim Day",
    description: "Straight-leg vintage denim with a hoodie and Chelsea boots for an easy daytime look.",
    coverPhoto: PHOTO.straightJeans,
    tags: ["Vintage", "Weekend"],
    listingIds: ["sample_listing_03", "sample_listing_01", "sample_listing_20"],
    daysAgo: 8,
  },
  {
    id: "sample_outfit_boho_sunday",
    title: "Boho Sunday",
    description: "A relaxed sundress with sandals and a shoulder bag for a slow Sunday.",
    coverPhoto: PHOTO.sundress,
    tags: ["Weekend"],
    listingIds: ["sample_listing_12", "sample_listing_19", "sample_listing_22"],
    daysAgo: 10,
  },
  {
    id: "sample_outfit_cold_weather_layers",
    title: "Cold Weather Layers",
    description: "Puffer coat over a hoodie with Chelsea boots for the colder months.",
    coverPhoto: PHOTO.pufferCoat,
    tags: ["Weekend", "Outerwear"],
    listingIds: ["sample_listing_04", "sample_listing_07", "sample_listing_20"],
    daysAgo: 1,
  },
];

async function writeSellers(batch: WriteBatch) {
  for (const seller of SELLERS) {
    batch.set(db.collection("users").doc(seller.id), {
      displayName: seller.displayName,
      bio: seller.bio,
      location: seller.location,
      createdAt: daysAgo(seller.daysAgo),
      isSample: true,
    });
  }
}

async function writeListings(batch: WriteBatch) {
  for (const listing of LISTINGS) {
    const { id, daysAgo: age, featured, ...rest } = listing;
    batch.set(db.collection("listings").doc(id), {
      ...rest,
      createdAt: daysAgo(age),
      featured: featured ?? false,
      isSample: true,
    });
  }
}

async function writeOutfits(batch: WriteBatch) {
  for (const outfit of OUTFITS) {
    const { id, daysAgo: age, ...rest } = outfit;
    batch.set(db.collection("outfits").doc(id), {
      ...rest,
      createdAt: daysAgo(age),
      isSample: true,
    });
  }
}

async function seed() {
  const batch = db.batch();
  await writeSellers(batch);
  await writeListings(batch);
  await writeOutfits(batch);
  await batch.commit();

  console.log(
    `Seeded ${SELLERS.length} sellers, ${LISTINGS.length} listings ` +
      `(${LISTINGS.filter((l) => l.featured).length} featured, ${LISTINGS.filter((l) => l.status === "sold").length} sold) ` +
      `and ${OUTFITS.length} outfits.`
  );
  console.log("Photo credits (Pexels, free license):");
  for (const [url, credit] of Object.entries(PHOTO_CREDITS)) {
    console.log(`  ${credit} — ${url}`);
  }
}

async function clear() {
  const collections = ["listings", "users", "outfits", "favorites"];
  let deleted = 0;

  for (const name of collections) {
    const snapshot = await db.collection(name).where("isSample", "==", true).get();
    if (snapshot.empty) continue;

    const batch = db.batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
    deleted += snapshot.size;
    console.log(`Deleted ${snapshot.size} sample doc(s) from "${name}".`);
  }

  console.log(`Done — removed ${deleted} sample document(s) in total.`);
}

const shouldClear = process.argv.includes("--clear");

(shouldClear ? clear() : seed()).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
