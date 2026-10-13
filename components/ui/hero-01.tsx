import HeroSection from "@/components/ui/hero-01-utils/hero";
import type { NavigationSection } from "@/components/ui/hero-01-utils/header";
import Header from "@/components/ui/hero-01-utils/header";

export default function AgencyHeroSection() {
  const navigationData: NavigationSection[] = [
    { title: "Beranda", href: "#", isActive: true },
    { title: "Sambutan", href: "#sambutan" },
    { title: "Fasilitas", href: "#fasilitas" },
    { title: "PPDB", href: "#ppdb" },
  ];

  // Tanpa wrapper <div>, supaya header sticky berlaku di seluruh halaman
  return (
    <>
      <Header navigationData={navigationData} />
      <main>
        <HeroSection />
      </main>
    </>
  );
}