import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Search, TicketCheck } from "lucide-react";
import { Navbar } from "../../shared/components/layout/Navbar";
import { Footer } from "../../shared/components/layout/Footer";
import { BackToHome, Button } from "../../shared/components/ui";
import { Input } from "../../shared/components/ui/Input";
import { ErrorState, LoadingSpinner } from "../../shared/components/feedback";
import { QueueNumberDisplay } from "../registration-status/components/QueueNumberDisplay";
import { PatientSummaryCard } from "../registration-status/components/PatientSummaryCard";
import { useQueueStatus } from "../../features/queue/hooks";

const checkSchema = z.object({
  kode: z
    .string()
    .trim()
    .min(5, "Kode booking minimal 5 karakter")
    .transform((v) => v.toUpperCase()),
});

type CheckFormData = z.infer<typeof checkSchema>;

export function CheckRegistrationPage() {
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckFormData>({
    resolver: zodResolver(checkSchema),
    mode: "onBlur",
  });

  const statusQuery = useQueueStatus(submittedCode);
  const data = statusQuery.data?.data ?? null;
  const isNotFound =
    !!statusQuery.error && (statusQuery.error as any)?.response?.status === 404;

  const onSubmit = (form: CheckFormData) => {
    setSubmittedCode(form.kode);
  };

  const handleReset = () => {
    // submittedCode null → query disabled (enabled: !!registrationId) → kembali ke form
    setSubmittedCode(null);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div
        className="relative min-h-screen px-6 pb-16 pt-28"
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
          <div className="mb-6">
            <BackToHome />
          </div>

          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="mb-8 text-center"
          >
            <h1 className="text-h1 font-bold" style={{ color: "var(--c-text)" }}>
              Cek Registrasi
            </h1>
            <p className="mt-2 text-body" style={{ color: "var(--c-text-muted)" }}>
              Masukkan kode booking untuk melihat nomor antrian & status pendaftaran
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {/* State: form input */}
            {!submittedCode && (
              <motion.div
                key="check-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="rounded-card border p-8 shadow-soft"
                style={{
                  backgroundColor: "var(--c-surface)",
                  borderColor: "var(--c-border)",
                }}
              >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <Input
                    label="Kode Booking"
                    placeholder="cth: 25092026POLIXXXX0001"
                    error={errors.kode?.message}
                    leadingIcon={<TicketCheck className="h-4 w-4" />}
                    {...register("kode")}
                  />
                  <Button
                    type="submit"
                    variant="gradient"
                    size="lg"
                    fullWidth
                    icon={<Search className="h-5 w-5" />}
                  >
                    Cek Status
                  </Button>
                </form>
              </motion.div>
            )}

            {/* State: loading */}
            {submittedCode && statusQuery.isLoading && (
              <motion.div
                key="check-loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center gap-4 rounded-card border p-12 shadow-soft"
                style={{
                  backgroundColor: "var(--c-surface)",
                  borderColor: "var(--c-border)",
                }}
              >
                <LoadingSpinner size="lg" />
                <p className="text-body" style={{ color: "var(--c-text-muted)" }}>
                  Mencari data pendaftaran...
                </p>
              </motion.div>
            )}

            {/* State: tidak ditemukan */}
            {submittedCode && isNotFound && (
              <motion.div
                key="check-notfound"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="rounded-card border p-8 shadow-soft"
                style={{
                  backgroundColor: "var(--c-surface)",
                  borderColor: "var(--c-border)",
                }}
              >
                <ErrorState
                  message={`Kode booking "${submittedCode}" tidak ditemukan. Periksa kembali kode Anda.`}
                  onRetry={handleReset}
                  retryLabel="Cek Kode Lain"
                />
              </motion.div>
            )}

            {/* State: error jaringan */}
            {submittedCode && statusQuery.isError && !isNotFound && (
              <motion.div
                key="check-error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="rounded-card border p-8 shadow-soft"
                style={{
                  backgroundColor: "var(--c-surface)",
                  borderColor: "var(--c-border)",
                }}
              >
                <ErrorState
                  message="Terjadi kesalahan jaringan. Silakan coba lagi."
                  onRetry={() => statusQuery.refetch()}
                />
              </motion.div>
            )}

            {/* State: hasil ditemukan */}
            {submittedCode && data && (
              <motion.div
                key="check-result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="space-y-6"
              >
                <div
                  className="rounded-card border p-8 shadow-soft"
                  style={{
                    backgroundColor: "var(--c-surface)",
                    borderColor: "var(--c-border)",
                  }}
                >
                  <QueueNumberDisplay queueNumber={data.queue_number} status={data.status} />
                </div>

                <PatientSummaryCard data={data} />

                <Button variant="secondary" size="md" fullWidth onClick={handleReset}>
                  Cek Kode Lain
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Footer />
    </div>
  );
}
