import CompaniesSection from "@/components/home/CompaniesSection";
import CTABanner from "@/components/home/CTABanner";
import ExploreByCategory from "@/components/home/ExploreByCategory";
import FeaturedJobs from "@/components/home/FeaturedJobs";
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
        <ExploreByCategory />
        <CTABanner />
        <FeaturedJobs />
      </main>
      <Footer />
    </>
  );
}
