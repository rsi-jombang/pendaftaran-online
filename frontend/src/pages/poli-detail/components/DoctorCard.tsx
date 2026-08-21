import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Card } from "../../../shared/components/ui/Card";
import { Badge } from "../../../shared/components/ui/Badge";
import type { Doctor } from "../../../features/schedule/types";

interface DoctorCardProps {
  doctor: Doctor;
  isSelected: boolean;
  onSelect: () => void;
}

export function DoctorCard({ doctor, isSelected, onSelect }: DoctorCardProps) {
  const isDisabled = doctor.quota_status === "full";
  const cardVariant = isDisabled ? "disabled" : isSelected ? "selected" : "interactive";

  return (
    <motion.div
      key={doctor.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        variant={cardVariant}
        onClick={isDisabled ? undefined : onSelect}
        className="relative"
      >
        {/* Checkmark overlay when selected */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute top-3 right-3 z-10"
            style={{
              width: 24,
              height: 24,
              backgroundColor: "var(--color-primary)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(15, 155, 142, 0.4)",
            }}
          >
            <Check className="w-4 h-4" style={{ color: "var(--color-surface)" }} strokeWidth={3} />
          </motion.div>
        )}

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
                <span className="text-sm font-medium text-white">Penuh</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-lg font-semibold truncate" style={{ color: "var(--color-text-primary)" }}>
              {doctor.name}
            </h4>
            <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
              {doctor.practice_hours}
            </p>
            <Badge
              status={doctor.quota_status === "available" ? "success" : "danger"}
              className="mt-2 inline-flex"
            >
              {doctor.quota_status === "available"
                ? `Kuota tersisa ${doctor.quota_remaining}`
                : "Kuota Penuh"}
            </Badge>
          </div>

          {/* Radio indicator */}
          <div className="flex-shrink-0">
            {isSelected ? (
              <div
                className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                style={{ borderColor: "var(--color-primary)", backgroundColor: "var(--color-primary)" }}
              >
                <Check className="w-3.5 h-3.5" style={{ color: "var(--color-surface)" }} strokeWidth={3} />
              </div>
            ) : isDisabled ? (
              <div
                className="w-6 h-6 rounded-full border-2 flex items-center justify-center opacity-50"
                style={{ borderColor: "var(--color-border)" }}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--color-text-secondary)" }} />
              </div>
            ) : (
              <div
                className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                style={{ borderColor: "var(--color-border)" }}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "transparent" }} />
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}