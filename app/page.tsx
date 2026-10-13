import HeroOne from "@/components/ui/hero-01";
import Sambutan from "@/components/sections/sambutan";
import Fasilitas from "@/components/sections/fasilitas";
import Ppdb from "@/components/sections/ppdb";
import Footer from "@/components/sections/footer";

export default function Page() {
  return (
    <>
      <HeroOne />
      <Sambutan />
      <Fasilitas />
      <Ppdb />
      <Footer />
    </>
  );
}