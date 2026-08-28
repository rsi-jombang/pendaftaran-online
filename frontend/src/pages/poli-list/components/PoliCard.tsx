import { ArrowRight, Clock } from "lucide-react";
import { PoliIcon } from "../../../shared/components/ui/PoliIcon";
import { getPoliGradient } from "../../../shared/utils/poliGradient";
import type { Poli } from "../../../features/poli/types";

interface PoliCardProps {
  poli: Poli;
  onClick: () => void;
}

export function PoliCard({ poli, onClick }: PoliCardProps) {
  const [from, to] = getPoliGradient(poli.nama_poli);

  return (
    <button
      onClick={onClick}
      className="group block w-full text-left rounded-card overflow-hidden bg-surface border border-border transition-all duration-200 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
    >
      {/* Gradient header */}
      <div
        className="relative h-24 flex items-center justify-center"
        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      >
        <PoliIcon
          namaPoli={poli.nama_poli}
          className="w-11 h-11 transition-transform duration-200 group-hover:scale-110"
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
  );
}
