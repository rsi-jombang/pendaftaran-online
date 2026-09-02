import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { StepIndicator } from "../../shared/components/ui";
import { NikForm } from "./components/NikForm";
import { PatientFoundCard } from "./components/PatientFoundCard";
import { NewPatientForm } from "./components/NewPatientForm";
import { useCheckNik, useRegisterPatient } from "../../features/nik";
import { LoadingSpinner, ErrorState } from "../../shared/components/feedback";
import { useRegistrationFlowStore } from "../../shared/store/registrationFlowStore";

type CheckResultState = "idle" | "loading" | "found" | "not-found" | "registering" | "error";

export function NikCheckPage() {
  const navigate = useNavigate();
  const { setPatient } = useRegistrationFlowStore();
  const [checkResult, setCheckResult] = useState<CheckResultState>("idle");
  const [patientData, setPatientData] = useState<{ name: string; nik: string } | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);

  const checkNikMutation = useCheckNik();
  const registerPatientMutation = useRegisterPatient();

  const handleCheckNik = useCallback(async (data: { nik: string }) => {
    setCheckResult("loading");
    setLastError(null);

    try {
      const response = await checkNikMutation.mutateAsync({ nik: data.nik });

      if (response.data.found && response.data.patient) {
        setPatientData({ name: response.data.patient.name, nik: response.data.patient.nik });
        setCheckResult("found");
      } else {
        setPatientData({ name: "", nik: data.nik });
        setCheckResult("not-found");
      }
    } catch {
      setLastError("Gagal memeriksa NIK. Silakan coba lagi.");
      setCheckResult("error");
    }
  }, [checkNikMutation]);

  const isLoadingState = checkResult === "loading";

  const handlePatientFound = useCallback(() => {
    const patient = checkNikMutation.data?.data?.patient;
    if (patient) {
      setPatient(patient);
      const hasSelection = !!useRegistrationFlowStore.getState().pendingSelection;
      navigate(hasSelection ? "/daftar" : "/poli");
    }
  }, [checkNikMutation.data, setPatient, navigate]);

  const handleRegisterPatient = useCallback(async (data: any) => {
    setCheckResult("registering");
    setLastError(null);

    try {
      const response = await registerPatientMutation.mutateAsync(data);
      if (response.data) {
        setPatient(response.data);
        const hasSelection = !!useRegistrationFlowStore.getState().pendingSelection;
        navigate(hasSelection ? "/daftar" : "/poli");
      }
    } catch {
      setLastError("Gagal mendaftarkan pasien. Silakan coba lagi.");
      setCheckResult("error");
    }
  }, [registerPatientMutation, setPatient, navigate]);

  const isRegisteringState = checkResult === "registering";

  const handleCancelRegister = useCallback(() => {
    setCheckResult("idle");
  }, []);

  const handleRetry = useCallback(() => {
    setCheckResult("idle");
    setLastError(null);
  }, []);

  const steps = ["Cek NIK", "Pilih Poli", "Jadwal & Form", "Status"];

  return (
    <div
      className="relative min-h-screen px-6 py-12"
      style={{ backgroundColor: "var(--c-bg)" }}
    >
      {/* Subtle blob background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="blob absolute -right-24 -top-24 h-[340px] w-[340px]"
          style={{ backgroundColor: "var(--c-primary-soft)", opacity: 0.5 }}
        />
      </div>

      <div className="relative mx-auto max-w-xl">
        {/* Step Indicator */}
        <StepIndicator currentStep={1} steps={steps} />

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="rounded-card border bg-surface p-8 shadow-soft"
          style={{ borderColor: "var(--c-border)" }}
        >
          {/* State: Initial Form */}
          <AnimatePresence mode="wait">
            {checkResult === "idle" && (
              <motion.div
                key="nik-form"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <NikForm
                  onSubmit={handleCheckNik}
                  isLoading={isLoadingState}
                  error={lastError || undefined}
                />
              </motion.div>
            )}

            {/* State: Loading */}
            {checkResult === "loading" && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center gap-4 py-12"
              >
                <LoadingSpinner size="lg" />
                <p className="text-body" style={{ color: "var(--c-text-muted)" }}>
                  Memeriksa data NIK...
                </p>
              </motion.div>
            )}

            {/* State: Patient Found */}
            {checkResult === "found" && patientData && (
              <motion.div
                key="found"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <PatientFoundCard
                  patient={{
                    id: "",
                    nik: patientData.nik,
                    name: patientData.name,
                    birth_date: "",
                    gender: "female",
                    phone: "",
                  } as any}
                  onContinue={handlePatientFound}
                />
              </motion.div>
            )}

            {/* State: Patient Not Found - Show Register Form */}
            {checkResult === "not-found" && patientData && (
              <motion.div
                key="not-found"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <NewPatientForm
                  nik={patientData.nik}
                  onSubmit={handleRegisterPatient}
                  isLoading={isRegisteringState}
                  error={lastError || undefined}
                  onCancel={handleCancelRegister}
                />
              </motion.div>
            )}

            {/* State: Error */}
            {checkResult === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <ErrorState
                  message={lastError || "Terjadi kesalahan. Silakan coba lagi."}
                  onRetry={handleRetry}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}