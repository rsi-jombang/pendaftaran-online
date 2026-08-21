import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { StepIndicator } from "../../shared/components/ui";
import { SelectionSummaryChip } from "./components/SelectionSummaryChip";
import { RegistrationForm } from "./components/RegistrationForm";
import { useRegistrationFlowStore } from "../../shared/store/registrationFlowStore";

export function RegistrationFormPage() {
  const navigate = useNavigate();
  const { patient, pendingSelection, reset } = useRegistrationFlowStore();

  // Route guard: redirect ke /poli jika pendingSelection kosong
  useEffect(() => {
    if (!pendingSelection) {
      navigate("/poli");
    }
  }, [pendingSelection, navigate]);

  // Route guard: redirect ke /cek-nik jika patient kosong
  useEffect(() => {
    if (pendingSelection && !patient) {
      navigate("/cek-nik");
    }
  }, [patient, pendingSelection, navigate]);

  // Jika redirect sedang berlangsung, tampilkan loading
  if (!pendingSelection || (pendingSelection && !patient)) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "var(--color-bg-base)" }}>
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--color-primary-light)" }}>
            <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "var(--color-primary)" }}>
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <p style={{ color: "var(--color-text-secondary)" }}>Memvalidasi data...</p>
        </div>
      </div>
    );
  }

  const steps = ["Cek NIK", "Form Pendaftaran", "Status"];

  return (
    <div className="min-h-screen py-12 px-6" style={{ backgroundColor: "var(--color-bg-base)" }}>
      <div className="max-w-2xl mx-auto">
        {/* Step Indicator - Step 2/3 */}
        <StepIndicator currentStep={2} steps={steps} />

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8 text-center"
        >
          <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>
            Form Pendaftaran
          </h1>
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
            Lengkapi data untuk mengkonfirmasi pendaftaran
          </p>
        </motion.div>

        {/* Registration Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <SelectionSummaryChip selection={pendingSelection!} />
          <RegistrationForm />
        </motion.div>

        {/* Back to Home Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mt-6"
        >
          <button
            onClick={() => {
              reset();
              navigate("/");
            }}
            className="w-full text-sm text-center"
            style={{ color: "var(--color-text-secondary)" }}
          >
            ← Batal & Kembali ke Beranda
          </button>
        </motion.div>
      </div>
    </div>
  );
}