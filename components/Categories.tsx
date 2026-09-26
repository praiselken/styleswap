import Link from "next/link";

const cats = [
  "Hoodies",
  "Jackets",
  "Vintage",
  "Streetwear",
  "Shoes",
  "Accessories",
  "Women",
  "Men",
];

export default function Categories() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold">Shop by category</h2>
          <p className="mt-1 text-sm opacity-75">
            Jump straight to what you’re looking for.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {cats.map((c) => (
            <a
              key={c}
              href={`/marketplace?category=${encodeURIComponent(c)}`}
              className="rounded-full border px-4 py-2 text-sm hover:bg-black/5"
            >
              {c}
            </a>
          ))}
        </div>

        <div className="mt-10 rounded-3xl border p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-semibold">Not sure where to start?</h3>
              <p className="mt-1 text-sm opacity-75">
                Browse full outfits built from real listings, then shop the look.
              </p>
            </div>
            <Link
              href="/outfits"
              className="inline-flex w-fit rounded-xl bg-white px-5 py-3 text-black transition hover:scale-105 hover:bg-transparent hover:text-white border border-white"
            >
              Shop the look
            </Link>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-semibold">Ready to sell your first item?</h3>
              <p className="mt-1 text-sm opacity-75">
                Upload photos, add a price, and go live in minutes.
              </p>
            </div>
            <a
              href="/create"
              className="inline-flex w-fit rounded-xl bg-white px-5 py-3 text-black transition hover:scale-105 hover:bg-transparent hover:text-white border border-white"
            >
              Create a listing
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}