import CompaniesSection from "@/components/home/CompaniesSection";
import HeroBanner from "@/components/home/HeroBanner";
import Navbar from "@/components/layout/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroBanner />
        <CompaniesSection />
      </main>
    </>
  );
}
