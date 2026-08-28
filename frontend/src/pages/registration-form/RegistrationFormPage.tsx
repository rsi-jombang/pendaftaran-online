import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, Stethoscope, User } from "lucide-react";
import { StepIndicator } from "../../shared/components/ui";
import { RegistrationForm } from "./components/RegistrationForm";
import { useRegistrationFlowStore } from "../../shared/store/registrationFlowStore";
import { format } from "date-fns";
import { id } from "date-fns/locale";

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
      <div
        className="flex min-h-screen items-center justify-center px-6"
        style={{ backgroundColor: "var(--c-bg)" }}
      >
        <div className="text-center">
          <div
            className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
            style={{ backgroundColor: "var(--c-primary-soft)" }}
          >
            <svg
              className="h-6 w-6 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ color: "var(--c-primary)" }}
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
          <p className="text-body" style={{ color: "var(--c-text-muted)" }}>
            Memvalidasi data...
          </p>
        </div>
      </div>
    );
  }

  const steps = ["Cek NIK", "Form Pendaftaran", "Status"];

  const formatDateShort = (dateStr: string): string => {
    const date = new Date(dateStr);
    return format(date, "EEE, d MMM yyyy", { locale: id });
  };

  return (
    <div
      className="relative min-h-screen px-6 py-12"
      style={{ backgroundColor: "var(--c-bg)" }}
    >
      {/* Blob background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="blob absolute -left-28 top-1/3 h-[300px] w-[300px]"
          style={{ backgroundColor: "var(--c-primary-soft)", opacity: 0.4 }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Step Indicator */}
        <StepIndicator currentStep={2} steps={steps} />

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="mb-8 text-center"
        >
          <h1 className="text-h1 font-bold" style={{ color: "var(--c-text)" }}>
            Form Pendaftaran
          </h1>
          <p className="mt-2 text-body" style={{ color: "var(--c-text-muted)" }}>
            Lengkapi data untuk mengkonfirmasi pendaftaran
          </p>
        </motion.div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Sidebar — Sticky Summary (Desktop) */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.1, ease: "easeOut" }}
            className="lg:col-span-1"
          >
            <div className="sticky top-6 space-y-4">
              {/* Ringkasan Pendaftaran Card */}
              <div
                className="overflow-hidden rounded-card border shadow-soft"
                style={{ backgroundColor: "var(--c-surface)", borderColor: "var(--c-border)" }}
              >
                {/* Gradient header */}
                <div
                  className="px-5 py-4"
                  style={{
                    background: "linear-gradient(135deg, var(--c-primary), var(--c-primary-dark))",
                  }}
                >
                  <h3 className="text-body font-semibold text-white">
                    Ringkasan Pendaftaran
                  </h3>
                </div>

                <div className="space-y-4 p-5">
                  {/* Poli */}
                  <div className="flex items-start gap-3">
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: "var(--c-primary-soft)" }}
                    >
                      <Stethoscope className="h-4 w-4" style={{ color: "var(--c-primary)" }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs" style={{ color: "var(--c-text-muted)" }}>Poli</p>
                      <p className="truncate text-small font-medium" style={{ color: "var(--c-text)" }}>
                        {pendingSelection.poliName}
                      </p>
                    </div>
                  </div>

                  {/* Dokter */}
                  <div className="flex items-start gap-3">
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: "var(--c-primary-soft)" }}
                    >
                      <User className="h-4 w-4" style={{ color: "var(--c-primary)" }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs" style={{ color: "var(--c-text-muted)" }}>Dokter</p>
                      <p className="truncate text-small font-medium" style={{ color: "var(--c-text)" }}>
                        {pendingSelection.doctorName}
                      </p>
                    </div>
                  </div>

                  {/* Tanggal */}
                  <div className="flex items-start gap-3">
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: "var(--c-primary-soft)" }}
                    >
                      <Calendar className="h-4 w-4" style={{ color: "var(--c-primary)" }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs" style={{ color: "var(--c-text-muted)" }}>Tanggal</p>
                      <p className="text-small font-medium" style={{ color: "var(--c-text)" }}>
                        {formatDateShort(pendingSelection.date)}
                      </p>
                    </div>
                  </div>

                  {/* Jam */}
                  <div className="flex items-start gap-3">
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: "var(--c-primary-soft)" }}
                    >
                      <Clock className="h-4 w-4" style={{ color: "var(--c-primary)" }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs" style={{ color: "var(--c-text-muted)" }}>Jam Praktek</p>
                      <p className="text-small font-medium" style={{ color: "var(--c-text)" }}>
                        {pendingSelection.practiceHours}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tombol Batal */}
              <button
                onClick={() => {
                  reset();
                  navigate("/");
                }}
                className="w-full py-2.5 text-center text-small transition-colors hover:opacity-80"
                style={{ color: "var(--c-text-muted)" }}
              >
                ← Batal & Kembali ke Beranda
              </button>
            </div>
          </motion.div>

          {/* Main Form Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15, ease: "easeOut" }}
            className="lg:col-span-2"
          >
            <RegistrationForm />
          </motion.div>
        </div>
      </div>
    </div>
  );
}