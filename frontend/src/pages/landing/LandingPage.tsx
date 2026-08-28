import { useNavigate } from "react-router-dom";
import { Navbar } from "../../shared/components/layout/Navbar";
import { Footer } from "../../shared/components/layout/Footer";
import { HeroSection } from "./components/HeroSection";
import { KeunggulanSection } from "./components/KeunggulanSection";
import { PoliSection } from "./components/PoliSection";
import { CtaBanner } from "./components/CtaBanner";
import { usePoliList } from "../../features/poli/hooks";

export function LandingPage() {
  const navigate = useNavigate();
  const { data: poliData, isLoading: isPoliLoading } = usePoliList();

  const polis = poliData?.data ?? [];
  const poliCount = polis.length;
  const doctorCount = polis.reduce((sum, poli) => sum + poli.jumlah_dokter, 0);

  const handlePoliSelect = (slugPoli: string) => {
    navigate(`/poli/${slugPoli}`);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <HeroSection poliCount={poliCount} doctorCount={doctorCount} />

      <KeunggulanSection />

      <PoliSection
        polis={polis}
        isLoading={isPoliLoading}
        onSelect={handlePoliSelect}
      />

      <CtaBanner />

      <Footer />
    </div>
  );
}