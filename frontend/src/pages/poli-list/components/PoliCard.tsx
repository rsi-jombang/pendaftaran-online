import { motion } from "framer-motion";
import { Card } from "../../../shared/components/ui/Card";
import type { Poli } from "../../../features/poli/types";
import {
  Baby,
  Heart,
  Eye,
  Stethoscope,
  Droplet,
  Activity,
  Brain,
  Clock,
} from "lucide-react";

// Fungsi untuk mendapatkan icon berdasarkan nama poli
function getPoliIcon(namaPoli: string): React.ReactNode {
  const nama = namaPoli.toLowerCase();
  if (nama.includes("anak")) return <Baby className="w-6 h-6" style={{ color: "var(--color-primary)" }} />;
  if (nama.includes("bedah")) return <Heart className="w-6 h-6" style={{ color: "var(--color-primary)" }} />;
  if (nama.includes("jantung") || nama.includes("kardiologi")) return <Heart className="w-6 h-6" style={{ color: "var(--color-primary)" }} />;
  if (nama.includes("mata")) return <Eye className="w-6 h-6" style={{ color: "var(--color-primary)" }} />;
  if (nama.includes("orthopedi") || nama.includes("orthopedy") || nama.includes("tulang")) return <Activity className="w-6 h-6" style={{ color: "var(--color-primary)" }} />;
  if (nama.includes("paru")) return <Activity className="w-6 h-6" style={{ color: "var(--color-primary)" }} />;
  if (nama.includes("interne") || nama.includes("penyakit dalam")) return <Stethoscope className="w-6 h-6" style={{ color: "var(--color-primary)" }} />;
  if (nama.includes("syaraf") || nama.includes("saraf") || nama.includes("neurologi")) return <Brain className="w-6 h-6" style={{ color: "var(--color-primary)" }} />;
  if (nama.includes("umum")) return <Stethoscope className="w-6 h-6" style={{ color: "var(--color-primary)" }} />;
  if (nama.includes("gigi") || nama.includes("dental")) return <Heart className="w-6 h-6" style={{ color: "var(--color-primary)" }} />;
  if (nama.includes("kulit") || nama.includes("dermatologi")) return <Droplet className="w-6 h-6" style={{ color: "var(--color-primary)" }} />;
  if (nama.includes("orthopedi")) return <Activity className="w-6 h-6" style={{ color: "var(--color-primary)" }} />;
  return <Stethoscope className="w-6 h-6" style={{ color: "var(--color-primary)" }} />;
}

interface PoliCardProps {
  poli: Poli;
  onClick: () => void;
}

export function PoliCard({ poli, onClick }: PoliCardProps) {
  return (
    <motion.div whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.98 }}>
      <Card variant="interactive" onClick={onClick} className="h-full">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <motion.div
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "var(--color-primary-light)" }}
          >
            {getPoliIcon(poli.nama_poli)}
          </motion.div>

          {/* Content */}
          <div className="flex-1 min-w-0 py-2">
            <h3
              className="text-lg font-semibold truncate mb-1"
              style={{ color: "var(--color-text-primary)" }}
            >
              {poli.nama_poli}
            </h3>
            <p className="text-sm mb-1" style={{ color: "var(--color-text-secondary)" }}>
              {poli.jumlah_dokter} dokter tersedia
            </p>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" style={{ color: "var(--color-text-secondary)" }} />
              <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                {poli.jam_praktek}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}