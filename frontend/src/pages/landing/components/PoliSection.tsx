import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import { EmptyState } from "../../../shared/components/feedback/EmptyState";
import { Skeleton } from "../../../shared/components/ui/Skeleton";
import { PoliIcon } from "../../../shared/components/ui/PoliIcon";
import { getPoliGradient } from "../../../shared/utils/poliGradient";
import type { Poli } from "../../../features/poli/types";

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.35, delay, ease: "easeOut" as const },
});

interface PoliSectionProps {
  polis: Poli[];
  isLoading: boolean;
  onSelect: (slugPoli: string) => void;
}

export function PoliSection({ polis, isLoading, onSelect }: PoliSectionProps) {
  return (
    <section id="layanan" className="py-20 px-6 lg:px-20">
      <div className="max-w-container mx-auto">
        {/* Header */}
        <motion.div {...reveal(0)} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-h2 md:text-h1 mb-2" style={{ color: "var(--c-text)" }}>
              Poli Buka Hari Ini
            </h2>
            <p className="text-body text-text-secondary">
              Poli yang tersedia untuk pendaftaran hari ini
            </p>
          </div>
          <Link
            to="/poli"
            className="hidden sm:inline-flex items-center gap-1 text-small font-medium text-primary hover:gap-2 transition-all"
          >
            Lihat semua poli
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} variant="card" height={210} />
            ))}
          </div>
        )}

        {/* Cards */}
        {!isLoading && (
          <>
            {polis.length === 0 ? (
              <EmptyState
                icon="inbox"
                title="Belum ada jadwal hari ini"
                description="Silakan cek kembali di lain waktu atau hubungi petugas RS."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {polis.map((poli, index) => (
                  <motion.div key={poli.slug_poli} {...reveal(index * 0.06)}>
                    <button
                      onClick={() => onSelect(poli.slug_poli)}
                      className="group block w-full text-left rounded-card overflow-hidden bg-surface border border-border transition-all duration-200 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                    >
                      {/* Gradient header */}
                      <div
                        className="relative h-24 flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${getPoliGradient(poli.nama_poli)[0]}, ${getPoliGradient(poli.nama_poli)[1]})`,
                        }}
                      >
                        <PoliIcon
                          namaPoli={poli.nama_poli}
                          className="w-11 h-11 transition-transform duration-200 group-hover:scale-115"
                          color="rgba(255, 255, 255, 0.92)"
                        />
                        <span className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/25 text-white opacity-0 translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>

                      {/* Body */}
                      <div className="p-5">
                        <h3
                          className="text-h3 font-semibold truncate mb-1.5"
                          style={{ color: "var(--c-text)" }}
                        >
                          {poli.nama_poli}
                        </h3>
                        <p className="text-small text-text-secondary mb-2.5">
                          {poli.jumlah_dokter} dokter tersedia hari ini
                        </p>
                        <p className="inline-flex items-center gap-1.5 text-small text-text-secondary">
                          <Clock className="w-4 h-4 shrink-0" />
                          {poli.jam_praktek}
                        </p>
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Mobile-only "see all" */}
            <motion.div {...reveal(0.4)} className="mt-8 text-center sm:hidden">
              <Link to="/poli">
                <span className="inline-flex items-center gap-1 text-small font-medium text-primary">
                  Lihat semua poli
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}