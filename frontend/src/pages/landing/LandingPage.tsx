import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../../shared/components/layout/Navbar";
import { Footer } from "../../shared/components/layout/Footer";
import { Button } from "../../shared/components/ui/Button";
import { Card } from "../../shared/components/ui/Card";
import { Skeleton } from "../../shared/components/ui/Skeleton";
import { usePoliList } from "../../features/poli/hooks";
import {
  Zap,
  Users,
  Activity,
  ShieldCheck,
  Baby,
  Heart,
  Eye,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";

const staggerDelay = 0.1; // 100ms

// Icon mapping untuk poli berdasarkan nama
function getPoliIcon(namaPoli: string): LucideIcon {
  const nama = namaPoli.toLowerCase();
  if (nama.includes("anak")) return Baby;
  if (nama.includes("bedah")) return Heart;
  if (nama.includes("jantung") || nama.includes("kardiologi")) return Heart;
  if (nama.includes("mata")) return Eye;
  if (nama.includes("orthopedi") || nama.includes("orthopedy") || nama.includes("tulang")) return Activity;
  if (nama.includes("paru")) return Activity;
  if (nama.includes("interne") || nama.includes("penyakit dalam")) return Stethoscope;
  if (nama.includes("syaraf") || nama.includes("saraf") || nama.includes("neurologi")) return Activity;
  if (nama.includes("umum")) return Stethoscope;
  if (nama.includes("gigi") || nama.includes("dental")) return Heart;
  if (nama.includes("kulit") || nama.includes("dermatologi")) return Activity;
  return Stethoscope;
}

const keunggulanData = [
  {
    icon: Zap,
    title: "Cepat",
    description: "Proses pendaftaran hanya dalam hitungan menit",
  },
  {
    icon: Users,
    title: "Tanpa Antre di Lokasi",
    description: "Daftar dari rumah, datang sesuai jadwal",
  },
  {
    icon: Activity,
    title: "Real-time",
    description: "Pantau posisi antrian secara langsung",
  },
  {
    icon: ShieldCheck,
    title: "Aman & Terverifikasi NIK",
    description: "Data terenkripsi dan tersinkronisasi",
  },
];

export function LandingPage() {
  const keunggulanRef = useRef(null);
  const poliRef = useRef(null);
  const isKeunggulanInView = useInView(keunggulanRef, { once: true, margin: "-100px" });
  const isPoliInView = useInView(poliRef, { once: true, margin: "-100px" });

  const { data: poliData, isLoading: isPoliLoading } = usePoliList();

  const handlePoliClick = (poliSlug: string) => {
    window.location.href = `/poli/${poliSlug}`;
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 lg:px-20 overflow-hidden">
        <div className="max-w-container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Text */}
            <div className="space-y-8">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0 }}
                className="text-[40px] lg:text-[56px] leading-tight font-bold"
                style={{ color: "var(--color-text-primary)" }}
              >
                Pendaftaran Poli Lebih Cepat, Tanpa Antre Lama
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: staggerDelay }}
                className="text-base max-w-lg"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Daftar poli secara online dengan mudah. Pilih jadwal dokter, dapatkan nomor
                antrian, dan pantau status pendaftaran Anda secara real-time.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: staggerDelay * 2 }}
              >
                <Link to="/cek-nik">
                  <Button variant="accent" size="lg">
                    Daftar Sekarang
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Hero Illustration Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: staggerDelay * 3 }}
              className="relative h-[400px] lg:h-[500px] hidden lg:block"
            >
              <div
                className="absolute inset-0 rounded-card flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, var(--color-primary-light) 0%, rgba(59, 130, 196, 0.1) 100%)",
                  borderRadius: "var(--radius-card)",
                }}
              >
                <div className="text-center space-y-4">
                  <div
                    className="w-24 h-24 mx-auto rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "rgba(15, 155, 142, 0.2)" }}
                  >
                    <svg
                      className="w-12 h-12"
                      style={{ color: "var(--color-primary)" }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                  </div>
                  <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                    [Ilustrasi Medis Placeholder]
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Keunggulan */}
      <section ref={keunggulanRef} className="py-20 px-6 lg:px-20" style={{ backgroundColor: "var(--color-surface)" }}>
        <div className="max-w-container mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isKeunggulanInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.3 }}
            className="text-3xl font-semibold text-center mb-12"
            style={{ color: "var(--color-text-primary)" }}
          >
            Mengapa Memilih Kami?
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {keunggulanData.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isKeunggulanInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card variant="default" className="text-center h-full">
                    <div
                      className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "var(--color-primary-light)" }}
                    >
                      <Icon className="w-8 h-8" style={{ color: "var(--color-primary)" }} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--color-text-primary)" }}>
                      {item.title}
                    </h3>
                    <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                      {item.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section Poli Buka Hari Ini */}
      <section ref={poliRef} className="py-20 px-6 lg:px-20">
        <div className="max-w-container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isPoliInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.3 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-semibold mb-4" style={{ color: "var(--color-text-primary)" }}>
              Poli Buka Hari Ini
            </h2>
            <p className="text-base max-w-2xl mx-auto" style={{ color: "var(--color-text-secondary)" }}>
              Poli yang tersedia untuk pendaftaran hari ini
            </p>
          </motion.div>

          {/* Loading State */}
          {isPoliLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} variant="card" height={180} />
              ))}
            </div>
          )}

          {/* Poli Cards */}
          {!isPoliLoading && poliData && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {poliData.data.slice(0, 6).map((poli, index) => {
                const Icon = getPoliIcon(poli.nama_poli) || Stethoscope;
                return (
                  <motion.div
                    key={poli.slug_poli}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isPoliInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card
                      variant="interactive"
                      onClick={() => handlePoliClick(poli.slug_poli)}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: "var(--color-primary-light)" }}
                        >
                          <Icon className="w-6 h-6" style={{ color: "var(--color-primary)" }} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-1" style={{ color: "var(--color-text-primary)" }}>
                            {poli.nama_poli}
                          </h3>
                          <p className="text-sm mb-3" style={{ color: "var(--color-text-secondary)" }}>
                            {poli.jumlah_dokter} dokter tersedia hari ini
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isPoliInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.3, delay: 0.6 }}
            className="text-center"
          >
            <Link to="/poli">
              <Button variant="secondary" size="md">
                Lihat Semua Poli
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}