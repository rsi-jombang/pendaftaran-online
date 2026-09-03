import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Share2, RefreshCw, Home, AlertTriangle } from "lucide-react";
import { StepIndicator, Button, Skeleton } from "../../shared/components/ui";
import { ErrorState } from "../../shared/components/feedback";
import { QueueNumberDisplay } from "./components/QueueNumberDisplay";
import { PatientSummaryCard } from "./components/PatientSummaryCard";
import { useQueueStatus } from "../../features/queue";
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

  // Initial data: Zustand → sessionStorage → null
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
  const initialData = zustandData || sessionData;

  // Fetch from API for polling and refresh-safe
  const {
    data: queueData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQueueStatus(registrationId || null);

  // Merge: API data > initial data (Zustand / sessionStorage)
  const displayData = queueData?.data || initialData;
  const isInitialLoading = isLoading && !initialData;

  // Save API data to sessionStorage for refresh safety
  if (queueData?.data) {
    saveToSessionStorage(queueData.data);
  }

  const handleBackHome = () => {
    reset();
    sessionStorage.removeItem(STORAGE_KEY);
    navigate("/");
  };

  const handleRetry = () => {
    refetch();
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

        {/* Loading State (only when no fallback data) */}
        {isInitialLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <Skeleton variant="card" height={300} />
            <Skeleton variant="card" height={200} />
          </motion.div>
        )}

        {/* Error State (only when no fallback data at all) */}
        {isError && !displayData && (
          <ErrorState
            message={error?.message || "Gagal memuat status pendaftaran"}
            onRetry={handleRetry}
            retryLabel="Coba Lagi"
          />
        )}

        {/* Content */}
        {displayData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="space-y-6"
          >
            {/* Polling error warning (show stale data, not error page) */}
            <AnimatePresence>
              {isError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 rounded-card border px-4 py-3 text-small"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--c-warning) 8%, transparent)",
                    borderColor: "color-mix(in srgb, var(--c-warning) 20%, transparent)",
                    color: "var(--c-warning)",
                  }}
                >
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>Gagal memperbarui data. Menampilkan data terakhir.</span>
                  <button
                    onClick={handleRetry}
                    className="ml-auto shrink-0 font-medium underline hover:no-underline"
                  >
                    Coba lagi
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

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

            {/* Polling Indicator */}
            <AnimatePresence>
              {isFetching && !isError && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="no-print:flex no-print:items-center no-print:justify-center no-print:gap-1.5 no-print:text-center no-print:text-xs"
                  style={{ color: "var(--c-text-muted)" }}
                >
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" style={{ color: "var(--c-primary)" }} />
                  <span>Memperbarui posisi antrian...</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

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