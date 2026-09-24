import ListingCard from "./ListingCard";

// Demo cards for the landing page — not real listings. Photos are
// hand-picked from Pexels (free license, no attribution required);
// photographers credited below anyway as a courtesy.
const demo = [
  {
    title: "Vintage Nike Hoodie",
    price: 25,
    tag: "Trending",
    meta: "Used • Great",
    photo: "https://images.pexels.com/photos/28468584/pexels-photo-28468584.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", // Erick Nathng
  },
  {
    title: "Carhartt Jacket",
    price: 45,
    tag: "New",
    meta: "Used • Excellent",
    photo: "https://images.pexels.com/photos/6028279/pexels-photo-6028279.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", // Mohamed Abdi Hujaale
  },
  {
    title: "Levi’s 501 Jeans",
    price: 22,
    tag: "Deal",
    meta: "Used • Good",
    photo: "https://images.pexels.com/photos/6439226/pexels-photo-6439226.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", // Lucas Castro
  },
  {
    title: "Puffer Coat",
    price: 35,
    tag: "Hot",
    meta: "Used • Great",
    photo: "https://images.pexels.com/photos/14663219/pexels-photo-14663219.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", // Rodrigo Arrosquipa
  },
  {
    title: "Graphic Tee Bundle",
    price: 15,
    tag: "Bundle",
    meta: "Used • Good",
    photo: "https://images.pexels.com/photos/9902629/pexels-photo-9902629.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", // armağan .
  },
  {
    title: "Vintage Handbag",
    price: 28,
    tag: "Rare",
    meta: "Used • Great",
    photo: "https://images.pexels.com/photos/26954376/pexels-photo-26954376.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", // José Martin Segura Benites
  },
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
