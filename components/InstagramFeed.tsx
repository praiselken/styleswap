import Image from "next/image";

// Static stand-ins for a real Instagram embed — this app has no Instagram
// integration, just a grid that reads like one for the demo. Photos are
// from Pexels (free license, no attribution required); photographer
// credited below anyway as a courtesy.
const posts = [
  {
    id: 3395708,
    src: "https://images.pexels.com/photos/3395708/pexels-photo-3395708.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    photographer: "Cheda Stankovic",
    likes: 214,
  },
  {
    id: 8743972,
    src: "https://images.pexels.com/photos/8743972/pexels-photo-8743972.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    photographer: "Farhad Ibrahimzade",
    likes: 96,
  },
  {
    id: 18533668,
    src: "https://images.pexels.com/photos/18533668/pexels-photo-18533668.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    photographer: "Tien Nguyen",
    likes: 341,
  },
  {
    id: 5771897,
    src: "https://images.pexels.com/photos/5771897/pexels-photo-5771897.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    photographer: "Jake Swoyer",
    likes: 58,
  },
  {
    id: 27204275,
    src: "https://images.pexels.com/photos/27204275/pexels-photo-27204275.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    photographer: "José Martin Segura Benites",
    likes: 127,
  },
  {
    id: 3406022,
    src: "https://images.pexels.com/photos/3406022/pexels-photo-3406022.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    photographer: "Brett Sayles",
    likes: 203,
  },
];

export default function InstagramFeed() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">@styleswap on Instagram</h2>
            <p className="mt-1 text-sm opacity-75">Community fits, tagged #styleswap.</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 md:grid-cols-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="group relative aspect-square overflow-hidden rounded-xl bg-white/10"
            >
              <Image
                src={post.src}
                alt=""
                fill
                sizes="(min-width: 768px) 16vw, 33vw"
                className="object-cover transition duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
                <span className="flex items-center gap-1 text-sm font-medium">
                  <span aria-hidden>♥</span> {post.likes}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
