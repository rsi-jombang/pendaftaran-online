import { useNavigate } from "react-router-dom";
import { Navbar } from "../../shared/components/layout/Navbar";
import { Footer } from "../../shared/components/layout/Footer";
import { HeroSection } from "./components/HeroSection";
import { KeunggulanSection } from "./components/KeunggulanSection";
import { PoliSection } from "./components/PoliSection";
import { CtaBanner } from "./components/CtaBanner";
import { usePoliListToday, useDoctorSchedule } from "../../features/poli/hooks";
import { pickOfDay, todayLocalStr } from "../../shared/lib/pickOfDay";

export function LandingPage() {
  const navigate = useNavigate();
  const { data: poliData, isLoading: isPoliLoading } = usePoliListToday();

  const polis = poliData?.data ?? [];
  const poliCount = polis.length;
  const doctorCount = polis.reduce((sum, poli) => sum + poli.jumlah_dokter, 0);

  // Dokter & poli unggulan hari ini (deterministik per tanggal)
  const todayStr = todayLocalStr();
  const activePolis = polis.filter((poli) => poli.jumlah_dokter > 0);
  const featuredPoli = pickOfDay(activePolis, todayStr);
  const { data: scheduleData } = useDoctorSchedule(featuredPoli?.slug_poli ?? null, todayStr);
  const doctors = scheduleData?.data?.doctors ?? [];
  const openDoctors = doctors.filter((doctor) => doctor.status === "BUKA");
  const candidateDoctors = openDoctors.length > 0 ? openDoctors : doctors;
  const featuredDoctor = pickOfDay(candidateDoctors, todayStr);

  const handlePoliSelect = (slugPoli: string) => {
    navigate(`/poli/${slugPoli}`);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <HeroSection
        poliCount={poliCount}
        doctorCount={doctorCount}
        featuredDoctors={candidateDoctors}
        initialDoctor={featuredDoctor}
        featuredPoliName={featuredPoli?.nama_poli ?? ""}
      />

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