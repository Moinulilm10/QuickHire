import CompaniesSection from "@/components/home/CompaniesSection";
import CTABanner from "@/components/home/CTABanner";
import HeroBanner from "@/components/home/HeroBanner";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroBanner />
        <CompaniesSection />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
