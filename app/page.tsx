import Hero from "@/components/Hero";
import FeaturedListings from "@/components/FeaturedListings";
import Categories from "@/components/Categories";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <FeaturedListings />
      <Categories />
    </main>
  );
}