import { motion } from "framer-motion";
import { Badge } from "../../../shared/components/ui/Badge";
import { Card } from "../../../shared/components/ui/Card";
import type { Poli } from "../../../features/poli/types";
import {
  Baby,
  Heart,
  Eye,
  Stethoscope,
  Droplet,
  type LucideIcon,
} from "lucide-react";

// Icon mapping untuk poli
const iconMap: Record<string, LucideIcon> = {
  baby: Baby,
  heart: Heart,
  eye: Eye,
  stethoscope: Stethoscope,
  tooth: Heart, // fallback ke Heart untuk gigi
  droplet: Droplet,
};

interface PoliCardProps {
  poli: Poli;
  onClick: () => void;
}

export function PoliCard({ poli, onClick }: PoliCardProps) {
  const Icon = iconMap[poli.icon] || Stethoscope;
  const isDisabled = poli.quota_status === "full";

  return (
    <motion.div whileHover={!isDisabled ? { y: -4, scale: 1.01 } : {}} whileTap={!isDisabled ? { scale: 0.98 } : {}}>
      <Card
        variant={isDisabled ? "disabled" : "interactive"}
        onClick={onClick}
        className="h-full"
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          <motion.div
            initial={{ scale: 1 }}
            whileHover={!isDisabled ? { scale: 1.1 } : {}}
            transition={{ duration: 0.2 }}
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "var(--color-primary-light)" }}
          >
            <Icon className="w-6 h-6" style={{ color: "var(--color-primary)" }} />
          </motion.div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3
              className="text-lg font-semibold mb-1 truncate"
              style={{ color: "var(--color-text-primary)" }}
            >
              {poli.name}
            </h3>
            <p className="text-sm mb-3" style={{ color: "var(--color-text-secondary)" }}>
              {poli.doctors_today} dokter tersedia hari ini
            </p>
            <Badge status={poli.quota_status === "available" ? "success" : "danger"} pulse={isDisabled}>
              {poli.quota_status === "available"
                ? `Kuota tersisa ${poli.quota_remaining}`
                : "Kuota Penuh"}
            </Badge>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
