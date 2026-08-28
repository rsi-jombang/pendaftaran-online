import { motion } from "framer-motion";
import { ChevronRight, Clock } from "lucide-react";
import { Card } from "../../../shared/components/ui/Card";
import { Badge } from "../../../shared/components/ui/Badge";
import { Button } from "../../../shared/components/ui/Button";
import type { Doctor } from "../../../features/schedule/types";

interface DoctorCardProps {
  doctor: Doctor;
  onDaftar: () => void;
}

export function DoctorCard({ doctor, onDaftar }: DoctorCardProps) {
  // Tombol aktif kecuali kuota penuh (BPJS dengan sisa = 0)
  const isDisabled = doctor.quota_status === "full";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card variant={isDisabled ? "disabled" : "interactive"} className="relative group">
        <div className="flex items-center gap-4 p-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {doctor.avatar_url ? (
              <img
                src={doctor.avatar_url}
                alt={doctor.name}
                className="h-16 w-16 rounded-full object-cover ring-2 ring-border"
              />
            ) : (
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full ring-2 ring-border"
                style={{ backgroundColor: "var(--c-primary-soft)" }}
              >
                <svg
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: "var(--color-primary)" }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            )}
            {isDisabled && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                <span className="text-sm font-medium text-white">Penuh</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <h4
              className="mb-2 truncate text-lg font-semibold"
              style={{ color: "var(--c-text)" }}
            >
              {doctor.name}
            </h4>
            <p
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-small mb-2.5"
              style={{
                backgroundColor: "var(--c-surface-muted)",
                color: "var(--c-text-muted)",
              }}
            >
              <Clock className="w-3.5 h-3.5 shrink-0" />
              {doctor.practice_hours}
            </p>
            <div>
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
                  ? "∞ Kuota tidak terbatas"
                  : doctor.quota_status === "available"
                  ? `Kuota tersisa ${doctor.quota_remaining}`
                  : "Kuota Penuh"}
              </Badge>
            </div>
          </div>

          {/* Tombol Daftar */}
          <div className="flex-shrink-0">
            <Button
              variant="primary"
              size="sm"
              onClick={onDaftar}
              disabled={isDisabled}
              icon={
                <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              }
            >
              Daftar
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}