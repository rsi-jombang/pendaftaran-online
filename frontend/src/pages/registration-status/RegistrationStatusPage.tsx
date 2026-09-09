import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Download, Share2, Home } from "lucide-react";
import { StepIndicator, Button } from "../../shared/components/ui";
import { ErrorState } from "../../shared/components/feedback";
import { QueueNumberDisplay } from "./components/QueueNumberDisplay";
import { PatientSummaryCard } from "./components/PatientSummaryCard";
import { useRegistrationFlowStore } from "../../shared/store/registrationFlowStore";
import type { RegistrationStatus } from "../../features/queue/types";

const STORAGE_KEY = "pendaftaran_last_result";

function saveToSessionStorage(data: RegistrationStatus) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage full or private browsing — silently ignore
  }
}

function loadFromSessionStorage(): RegistrationStatus | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as RegistrationStatus;
  } catch {
    return null;
  }
}

export function RegistrationStatusPage() {
  const navigate = useNavigate();
  const { registrationId } = useParams<{ registrationId: string }>();
  const { registrationResult, reset } = useRegistrationFlowStore();

  // Data statis: Zustand → sessionStorage
  const zustandData: RegistrationStatus | null = registrationResult
    ? {
        registration_id: registrationResult.registration_id,
        queue_number: registrationResult.queue_number,
        status: registrationResult.status,
        queue_position: registrationResult.queue_position,
        estimated_wait_minutes: registrationResult.estimated_wait_minutes,
        is_bpjs: registrationResult.is_bpjs,
        patient: registrationResult.patient,
        poli: registrationResult.poli,
        doctor: registrationResult.doctor,
        schedule: registrationResult.schedule,
      }
    : null;

  const sessionData = loadFromSessionStorage();
  const displayData = zustandData || sessionData;

  // Simpan ke sessionStorage untuk refresh safety (hanya dari Zustand)
  if (zustandData) {
    saveToSessionStorage(zustandData);
  }

  const handleBackHome = () => {
    reset();
    sessionStorage.removeItem(STORAGE_KEY);
    navigate("/");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share && displayData) {
      try {
        await navigator.share({
          title: "Bukti Pendaftaran Poli",
          text: `Nomor Antrian: ${displayData.queue_number}\nPasien: ${displayData.patient.name}\nPoli: ${displayData.poli.name}`,
        });
      } catch {
        // User cancelled
      }
    }
  };

  // No registrationId → redirect error
  if (!registrationId) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6" style={{ backgroundColor: "var(--c-bg)" }}>
        <ErrorState
          message="ID pendaftaran tidak ditemukan"
          onRetry={() => navigate("/")}
          retryLabel="Kembali ke Beranda"
        />
      </div>
    );
  }

  const steps = ["Cek NIK", "Pilih Poli", "Jadwal & Form", "Status"];

  const statusGlowMap = {
    waiting: "var(--c-warning)",
    in_service: "var(--c-secondary)",
    done: "var(--c-success)",
  };

  const statusGlow = displayData ? statusGlowMap[displayData.status] : "var(--c-primary)";

  // Tanpa data sama sekali → error
  if (!displayData) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6" style={{ backgroundColor: "var(--c-bg)" }}>
        <ErrorState
          message="Data pendaftaran tidak ditemukan. Silakan daftar ulang."
          onRetry={() => navigate("/")}
          retryLabel="Kembali ke Beranda"
        />
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen px-6 py-12"
      style={{ backgroundColor: "var(--c-bg)" }}
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2"
          style={{
            width: "600px",
            height: "400px",
            background: `radial-gradient(ellipse at center top, ${statusGlow}12 0%, transparent 65%)`,
          }}
        />
      </div>

      <div className="relative mx-auto max-w-2xl">
        {/* Step Indicator */}
        <div className="no-print">
          <StepIndicator currentStep={4} steps={steps} />
        </div>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="mb-8 text-center"
        >
          <h1 className="text-h1 font-bold" style={{ color: "var(--c-text)" }}>
            Status Pendaftaran
          </h1>
          <p className="mt-2 text-small font-mono" style={{ color: "var(--c-text-muted)" }}>
            ID: {registrationId}
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="space-y-6"
        >
          {/* Hero Status Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 20, delay: 0.1 }}
            className="no-print:overflow-hidden no-print:rounded-card no-print:border"
            style={{
              backgroundColor: "var(--c-surface)",
              borderColor: "var(--c-border)",
            }}
          >
            {/* Gradient header bar */}
            <div
              className="px-6 py-3 text-center"
              style={{
                background: `linear-gradient(135deg, color-mix(in srgb, ${statusGlow} 80%, var(--c-primary-dark)), ${statusGlow})`,
              }}
            >
              <p className="text-small font-semibold text-white">
                {displayData.status === "done"
                  ? "Pendaftaran Selesai!"
                  : "Pendaftaran Berhasil!"}
              </p>
            </div>

            {/* Queue display */}
            <div className="px-6 py-8">
              <QueueNumberDisplay
                queueNumber={displayData.queue_number}
                status={displayData.status}
              />
            </div>
          </motion.div>

          {/* Patient Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2, ease: "easeOut" }}
          >
            <PatientSummaryCard data={displayData} />
          </motion.div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.3, ease: "easeOut" }}
          className="no-print:mt-8 no-print:space-y-3"
        >
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onClick={handlePrint}
              icon={<Download className="h-4 w-4" />}
            >
              Unduh / Cetak
            </Button>
            <Button
              variant="ghost"
              size="lg"
              fullWidth
              onClick={handleShare}
              icon={<Share2 className="h-4 w-4" />}
            >
              Bagikan
            </Button>
          </div>

          <Button
            variant="ghost"
            size="md"
            fullWidth
            onClick={handleBackHome}
            icon={<Home className="h-4 w-4" />}
          >
            ← Kembali ke Beranda
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
