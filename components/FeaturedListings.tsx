import ListingCard from "./ListingCard";

const demo = [
  { title: "Vintage Nike Hoodie", price: 25, tag: "Trending", meta: "Used • Great" },
  { title: "Carhartt Jacket", price: 45, tag: "New", meta: "Used • Excellent" },
  { title: "Levi’s 501 Jeans", price: 22, tag: "Deal", meta: "Used • Good" },
  { title: "Puffer Coat", price: 35, tag: "Hot", meta: "Used • Great" },
  { title: "Graphic Tee Bundle", price: 15, tag: "Bundle", meta: "Used • Good" },
  { title: "Vintage Handbag", price: 28, tag: "Rare", meta: "Used • Great" },
];

export default function FeaturedListings() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Trending right now</h2>
            <p className="mt-1 text-sm opacity-75">
              Fresh finds added by the community.
            </p>
          </div>

          <a href="/marketplace" className="text-sm underline">
            View all
          </a>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {demo.map((item) => (
            <ListingCard key={item.title} {...item} href="/marketplace" />
          ))}
        </div>
      </div>
    </section>
  );
}
