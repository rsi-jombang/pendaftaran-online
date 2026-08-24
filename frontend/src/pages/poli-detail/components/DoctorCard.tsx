import { motion } from "framer-motion";
import { Card } from "../../../shared/components/ui/Card";
import { Badge } from "../../../shared/components/ui/Badge";
import { Button } from "../../../shared/components/ui/Button";
import type { Doctor } from "../../../features/schedule/types";

interface DoctorCardProps {
  doctor: Doctor;
  onDaftar: () => void;
}

export function DoctorCard({ doctor, onDaftar }: DoctorCardProps) {
  // Opsi A: Tombol aktif kecuali kuota penuh (BPJS dengan sisa = 0)
  // Non-BPJS (unlimited) tidak pernah disabled
  // BPJS: disabled jika quota_status === "full" (sisa = 0)
  const isDisabled = doctor.quota_status === "full";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card variant={isDisabled ? "disabled" : "interactive"} className="relative">
        <div className="flex items-center gap-4 p-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {doctor.avatar_url ? (
              <img
                src={doctor.avatar_url}
                alt={doctor.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "var(--color-primary-light)" }}
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "var(--color-primary)" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
            {isDisabled && (
              <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                <span className="text-sm font-medium text-white">Kuota Penuh</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-lg font-semibold truncate" style={{ color: "var(--color-text-primary)" }}>
                {doctor.name}
              </h4>
            </div>
            <p className="text-sm mb-2" style={{ color: "var(--color-text-secondary)" }}>
              {doctor.practice_hours}
            </p>
            <Badge
              status={
                doctor.quota_status === "unlimited"
                  ? "info"
                  : doctor.quota_status === "available"
                  ? "success"
                  : "danger"
              }
              className="inline-flex"
            >
              {doctor.quota_status === "unlimited"
                ? "∞"
                : doctor.quota_status === "available"
                ? `Kuota tersisa ${doctor.quota_remaining}`
                : "Kuota Penuh"}
            </Badge>
          </div>

          {/* Tombol Daftar */}
          <div className="flex-shrink-0">
            <Button
              variant="primary"
              size="sm"
              onClick={onDaftar}
              disabled={isDisabled}
            >
              Daftar
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}