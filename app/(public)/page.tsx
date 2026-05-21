import HeroSection from "@/components/home/hero-section";
import FeaturedBooks from "@/components/books/featured-books";
import CategoriesSection from "@/components/home/categories-section";

export default function HomePage() {
  return (
    <div className="space-y-24 pb-24">
      <HeroSection />

      <FeaturedBooks />

      <CategoriesSection />
    </div>
  );
}
