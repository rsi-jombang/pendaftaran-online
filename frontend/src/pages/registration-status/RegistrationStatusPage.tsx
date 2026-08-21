import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Download, Share2, RefreshCw, Home } from "lucide-react";
import { StepIndicator, Button, Skeleton } from "../../shared/components/ui";
import { ErrorState } from "../../shared/components/feedback";
import { QueueNumberDisplay } from "./components/QueueNumberDisplay";
import { PatientSummaryCard } from "./components/PatientSummaryCard";
import { useQueueStatus } from "../../features/queue";
import { useRegistrationFlowStore } from "../../shared/store/registrationFlowStore";
import type { RegistrationStatus } from "../../features/queue/types";

export function RegistrationStatusPage() {
  const navigate = useNavigate();
  const { registrationId } = useParams<{ registrationId: string }>();
  const { registrationResult, reset } = useRegistrationFlowStore();

  // Initial data from Zustand (result of submit in Halaman 4)
  const initialData: RegistrationStatus | null = registrationResult
    ? {
        registration_id: registrationResult.registration_id,
        queue_number: registrationResult.queue_number,
        status: registrationResult.status,
        queue_position: registrationResult.queue_position,
        estimated_wait_minutes: registrationResult.estimated_wait_minutes,
        patient: {
          name: "",
          nik_masked: "",
        },
        poli: { name: "" },
        doctor: { name: "" },
        schedule: { date: "", practice_hours: "" },
      }
    : null;

  // Fetch from API for polling and refresh-safe
  const {
    data: queueData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQueueStatus(registrationId || null);

  // Merge initial data with fetched data (fetched data takes precedence)
  const displayData = queueData?.data || initialData;
  const isInitialLoading = isLoading && !initialData;

  // Handle back to home - reset store
  const handleBackHome = () => {
    reset();
    navigate("/");
  };

  // Handle retry
  const handleRetry = () => {
    refetch();
  };

  // Handle print/download
  const handlePrint = () => {
    window.print();
  };

  // Handle share (Web Share API if available)
  const handleShare = async () => {
    if (navigator.share && displayData) {
      try {
        await navigator.share({
          title: "Bukti Pendaftaran Poli",
          text: `Nomor Antrian: ${displayData.queue_number}\nPasien: ${displayData.patient.name}\nPoli: ${displayData.poli.name}`,
        });
      } catch {
        // User cancelled or error
      }
    }
  };

  if (!registrationId) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <ErrorState
          message="ID pendaftaran tidak ditemukan"
          onRetry={() => navigate("/")}
          retryLabel="Kembali ke Beranda"
        />
      </div>
    );
  }

  const steps = ["Cek NIK", "Pilih Poli", "Jadwal & Form", "Status"];

  return (
    <div className="min-h-screen py-12 px-6 no-print:bg-bg-base" style={{ backgroundColor: "var(--color-bg-base)" }}>
      <div className="max-w-2xl mx-auto">
        {/* Step Indicator - Step 4 Completed */}
        <div className="no-print">
          <StepIndicator currentStep={4} steps={steps} />
        </div>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8 text-center"
        >
          <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>
            Status Pendaftaran
          </h1>
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
            ID: {registrationId}
          </p>
        </motion.div>

        {/* Loading State */}
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

        {/* Error State */}
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
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Hero Status Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="p-8 rounded-2xl text-center hero-status-card no-print:border"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                boxShadow: "0 4px 20px rgba(15, 155, 142, 0.08)",
              }}
            >
              <p className="text-lg font-semibold mb-4" style={{ color: "var(--color-success)" }}>
                Pendaftaran Berhasil!
              </p>

              <QueueNumberDisplay
                queueNumber={displayData.queue_number}
                status={displayData.status}
              />
            </motion.div>

            {/* Patient Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <PatientSummaryCard data={displayData} />
            </motion.div>

            {/* Polling Indicator */}
            {isFetching && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-xs polling-indicator no-print"
                style={{ color: "var(--color-text-secondary)" }}
              >
                <span className="flex items-center justify-center gap-1">
                  <RefreshCw className="w-4 h-4 animate-spin" style={{ color: "var(--color-primary)" }} />
                  Memperbarui posisi antrian...
                </span>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="mt-8 space-y-3 action-buttons no-print"
        >
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onClick={handlePrint}
              icon={<Download className="w-4 h-4" />}
              className="sticky bottom-4"
            >
              Unduh / Cetak
            </Button>
            <Button
              variant="ghost"
              size="lg"
              fullWidth
              onClick={handleShare}
              icon={<Share2 className="w-4 h-4" />}
            >
              Bagikan
            </Button>
          </div>

          <Button
            variant="ghost"
            size="md"
            fullWidth
            onClick={handleBackHome}
            icon={<Home className="w-4 h-4" />}
            className="text-sm"
          >
            ← Kembali ke Beranda
          </Button>
        </motion.div>
      </div>
    </div>
  );
}