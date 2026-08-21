import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "../../../shared/components/ui/Button";
import type { PatientData } from "../../../features/nik/types";

interface PatientFoundCardProps {
  patient: PatientData;
  onContinue: () => void;
}

export function PatientFoundCard({ patient, onContinue }: PatientFoundCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 mt-6"
    >
      <div
        className="flex flex-col items-center gap-4 p-6 rounded-card"
        style={{ backgroundColor: "rgba(34, 163, 102, 0.1)" }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "rgba(34, 163, 102, 0.2)" }}
        >
          <Check className="w-8 h-8" style={{ color: "var(--color-success)" }} strokeWidth={3} />
        </motion.div>
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-1" style={{ color: "var(--color-text-primary)" }}>
            Data Anda Ditemukan
          </h3>
          <p className="text-lg font-medium" style={{ color: "var(--color-success)" }}>
            {patient.name}
          </p>
          <p className="text-sm mt-2" style={{ color: "var(--color-text-secondary)" }}>
            NIK: {patient.nik}
          </p>
        </div>
      </div>

      <Button variant="primary" size="lg" fullWidth onClick={onContinue}>
        Lanjut Pilih Poli
      </Button>
    </motion.div>
  );
}
