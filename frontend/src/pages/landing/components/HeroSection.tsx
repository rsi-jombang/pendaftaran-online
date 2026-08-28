import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CalendarClock } from "lucide-react";
import { Button } from "../../../shared/components/ui/Button";

const HERO_IMG =
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&q=80&auto=format&fit=crop";

const staggerDelay = 0.1;

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay, ease: "easeOut" as const },
});

interface HeroSectionProps {
  poliCount: number;
  doctorCount: number;
}

export function HeroSection({ poliCount, doctorCount }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 lg:pt-36 lg:pb-24 px-6">
      {/* Decorative blobs */}
      <div
        className="blob w-[420px] h-[420px] -top-32 -left-32"
        style={{ backgroundColor: "var(--c-primary-soft)", opacity: 0.8 }}
      />
      <div
        className="blob w-[380px] h-[380px] -bottom-40 -right-24"
        style={{
          background:
            "color-mix(in srgb, var(--color-secondary) 20%, transparent)",
        }}
      />

      <div className="relative max-w-container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — Copy */}
          <div className="space-y-7">
            <motion.div {...fadeUp(0)}>
              <span
                className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-label"
                style={{ color: "var(--color-primary)" }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: "var(--color-accent)" }}
                />
                Pendaftaran Online Rumah Sakit
              </span>
            </motion.div>

            <motion.h1
              {...fadeUp(staggerDelay)}
              className="text-display font-bold"
              style={{ color: "var(--c-text)" }}
            >
              Pendaftaran Poli Lebih Cepat,{" "}
              <span className="text-gradient">Tanpa Antre Lama</span>
            </motion.h1>

            <motion.p
              {...fadeUp(staggerDelay * 2)}
              className="text-body text-text-secondary max-w-lg"
            >
              Daftar poli secara online dengan mudah. Pilih jadwal dokter,
              dapatkan nomor antrian, dan pantau status pendaftaran Anda secara
              real-time.
            </motion.p>

            <motion.div
              {...fadeUp(staggerDelay * 3)}
              className="flex flex-wrap gap-3"
            >
              <Link to="/cek-nik">
                <Button variant="gradient" size="lg">
                  Daftar Sekarang
                </Button>
              </Link>
              <Link to="/poli">
                <Button variant="ghost" size="lg" icon={<CalendarClock className="w-5 h-5" />}>
                  Lihat Jadwal Poli
                </Button>
              </Link>
            </motion.div>

            {/* Trust stats */}
            <motion.div
              {...fadeUp(staggerDelay * 4)}
              className="flex items-center gap-6 pt-2 text-small text-text-secondary"
            >
              <span className="flex items-baseline gap-1.5">
                <span className="text-h3 font-bold text-primary">{poliCount}</span>
                Poli hari ini
              </span>
              <span
                className="h-4 w-px"
                style={{ backgroundColor: "var(--c-line)" }}
              />
              <span className="flex items-baseline gap-1.5">
                <span className="text-h3 font-bold text-primary">{doctorCount}</span>
                Dokter bertugas
              </span>
            </motion.div>
          </div>

          {/* Right — Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.25, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            {/* Photo frame */}
            <div
              className="relative ml-auto max-w-[440px] aspect-[4/5] rounded-card overflow-hidden shadow-soft"
              style={{ backgroundColor: "var(--c-primary-soft)" }}
            >
              <img
                src={HERO_IMG}
                alt="Dokter melayani pasien"
                decoding="async"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <div
                className="absolute inset-x-0 bottom-0 h-24"
                style={{
                  background:
                    "linear-gradient(to top, color-mix(in srgb, var(--color-primary-dark) 55%, transparent), transparent)",
                }}
              />
            </div>

            {/* Floating card 1 — Queue number */}
            <div className="glass animate-float absolute -left-10 bottom-14 rounded-card p-5 shadow-soft">
              <p className="text-label uppercase" style={{ color: "var(--c-text-muted)" }}>
                Nomor Antrian Anda
              </p>
              <p
                className="font-mono text-4xl font-bold mt-1"
                style={{ color: "var(--color-primary)" }}
              >
                A-014
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--c-text-muted)" }}>
                Sedang menunggu panggilan
              </p>
            </div>

            {/* Floating card 2 — Doctor chip */}
            <div className="glass animate-float-delayed absolute -right-4 top-10 rounded-input p-3 pr-5 flex items-center gap-3 shadow-soft">
              <img
                src="/doctor-female.png"
                alt="dr. Sarah Wijaya"
                className="h-11 w-11 rounded-full object-cover"
              />
              <div>
                <p className="text-small font-semibold" style={{ color: "var(--c-text)" }}>
                  dr. Sarah Wijaya, Sp.A
                </p>
                <p className="text-xs" style={{ color: "var(--c-text-muted)" }}>
                  09:00 – 12:00 · Poli Anak
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
