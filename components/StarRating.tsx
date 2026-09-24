export default function StarRating({
  rating,
  reviewCount,
  className,
}: {
  rating: number;
  reviewCount: number;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-1 text-sm ${className ?? ""}`}>
      <span aria-hidden className="text-yellow-300">
        ★
      </span>
      <span>{rating.toFixed(1)}</span>
      <span className="opacity-60">
        ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
      </span>
    </span>
  );
}
