import Hero from "@/components/Hero";
import FeaturedListings from "@/components/FeaturedListings";
import Categories from "@/components/Categories";
import InstagramFeed from "@/components/InstagramFeed";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <FeaturedListings />
      <Categories />
      <InstagramFeed />
    </main>
  );
}