import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProductsSection from "@/components/ProductsSection";
import FeaturesSection from "@/components/FeaturesSection";
import IntegrationSection from "@/components/IntegrationSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <ProductsSection />
        <FeaturesSection />
        <IntegrationSection />
      </main>
      <Footer />
    </div>
  );
}
