import { useState } from "react";
import { motion } from "framer-motion";
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

  const handleCheckNik = async (data: { nik: string }) => {
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
  };

  const isLoadingState = checkResult === "loading";

  const handlePatientFound = () => {
    // Patient data sudah ada dari cek NIK
    const patient = checkNikMutation.data?.data?.patient;
    if (patient) {
      setPatient(patient);
      navigate("/poli");
    }
  };

  const handleRegisterPatient = async (data: any) => {
    setCheckResult("registering");
    setLastError(null);
    
    try {
      const response = await registerPatientMutation.mutateAsync(data);
      if (response.data) {
        setPatient(response.data);
        navigate("/poli");
      }
    } catch {
      setLastError("Gagal mendaftarkan pasien. Silakan coba lagi.");
      setCheckResult("error");
    }
  };

  const isRegisteringState = checkResult === "registering";

  const handleCancelRegister = () => {
    setCheckResult("idle");
  };

  const handleRetry = () => {
    setCheckResult("idle");
  };

  const steps = ["Cek NIK", "Pilih Poli", "Jadwal & Form", "Status"];

  return (
    <div className="min-h-screen py-12 px-6" style={{ backgroundColor: "var(--color-bg-base)" }}>
      <div className="max-w-md mx-auto">
        {/* Step Indicator */}
        <StepIndicator currentStep={1} steps={steps} />

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-surface rounded-card shadow-soft p-8"
          style={{ backgroundColor: "var(--color-surface)" }}
        >
          {/* State: Initial Form */}
          {checkResult === "idle" && (
            <NikForm onSubmit={handleCheckNik} isLoading={isLoadingState} error={lastError || undefined} />
          )}

          {/* State: Loading */}
          {checkResult === "loading" && (
            <div className="flex flex-col items-center gap-4 py-12">
              <LoadingSpinner size="lg" />
              <p style={{ color: "var(--color-text-secondary)" }}>Memeriksa data...</p>
            </div>
          )}

          {/* State: Patient Found */}
          {checkResult === "found" && patientData && (
            <PatientFoundCard
              patient={{ 
                id: "", 
                nik: patientData.nik, 
                name: patientData.name, 
                birth_date: "", 
                gender: "female", 
                phone: "" 
              } as any}
              onContinue={handlePatientFound}
            />
          )}

          {/* State: Patient Not Found - Show Register Form */}
          {checkResult === "not-found" && patientData && (
            <NewPatientForm
              nik={patientData.nik}
              onSubmit={handleRegisterPatient}
              isLoading={isRegisteringState}
              error={lastError || undefined}
              onCancel={handleCancelRegister}
            />
          )}

          {/* State: Error */}
          {checkResult === "error" && (
            <ErrorState
              message={lastError || "Terjadi kesalahan. Silakan coba lagi."}
              onRetry={handleRetry}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}