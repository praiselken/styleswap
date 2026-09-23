import Image from "next/image";

export type ListingCardProps = {
  title: string;
  price: number;
  /** First photo URL, if the listing has one. */
  photo?: string;
  /** Small pill in the top-left, e.g. "Trending" or a category. */
  tag?: string;
  /** Supporting line under the title, e.g. "Used • Great". */
  meta?: string;
  href?: string;
};

export default function ListingCard({
  title,
  price,
  photo,
  tag,
  meta,
  href,
}: ListingCardProps) {
  const card = (
    <article className="h-full rounded-2xl border border-white/20 bg-black/20 p-4 backdrop-blur-sm transition hover:border-white/50">
      <div className="flex items-center justify-between gap-2">
        {tag ? (
          <span className="rounded-full border border-white/30 px-2 py-1 text-xs">{tag}</span>
        ) : (
          <span />
        )}
        <span className="text-sm font-semibold">£{price}</span>
      </div>

      <div className="relative mt-3 aspect-[4/3] w-full overflow-hidden rounded-xl bg-white/10">
        {photo ? (
          <Image
            src={photo}
            alt={title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs opacity-50">
            No photo yet
          </div>
        )}
      </div>

      <div className="mt-3">
        <p className="font-medium">{title}</p>
        {meta && <p className="mt-1 text-xs opacity-70">{meta}</p>}
      </div>
    </article>
  );

  if (!href) return card;

  return (
    <a href={href} className="block h-full rounded-2xl focus:outline-2 focus:outline-offset-2">
      {card}
    </a>
  );
}
