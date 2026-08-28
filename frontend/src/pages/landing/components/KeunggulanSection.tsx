import { motion } from "framer-motion";
import { Zap, Users, Activity, ShieldCheck, type LucideIcon } from "lucide-react";

interface KeunggulanItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

const keunggulanData: KeunggulanItem[] = [
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

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.35, delay, ease: "easeOut" as const },
});

export function KeunggulanSection() {
  return (
    <section className="py-20 px-6 lg:px-20 bg-surface">
      <div className="max-w-container mx-auto">
        <motion.h2
          {...reveal(0)}
          className="text-h2 md:text-h1 text-center mb-3"
          style={{ color: "var(--c-text)" }}
        >
          Mengapa Memilih Kami?
        </motion.h2>
        <motion.p
          {...reveal(0.05)}
          className="text-body text-text-secondary text-center mb-12 max-w-xl mx-auto"
        >
          Layanan pendaftaran yang dirancang untuk kenyamanan pasien
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {keunggulanData.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div key={item.title} {...reveal(index * 0.1)} className="h-full">
                <div className="group h-full p-6 rounded-card bg-surface border border-border transition-all duration-200 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-soft cursor-default">
                  <div className="w-14 h-14 mb-5 rounded-card bg-gradient-primary flex items-center justify-center shadow-soft transition-transform duration-200 group-hover:scale-110 group-hover:rotate-3">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3
                    className="text-h3 font-semibold mb-2"
                    style={{ color: "var(--c-text)" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-small text-text-secondary leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
