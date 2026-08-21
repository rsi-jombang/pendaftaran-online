import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Badge } from "../../../shared/components/ui/Badge";
import { Card } from "../../../shared/components/ui/Card";
import { Input } from "../../../shared/components/ui/Input";
import { Button } from "../../../shared/components/ui/Button";
import { ErrorState } from "../../../shared/components/feedback/ErrorState";
import { useSubmitRegistration } from "../../../features/registration/hooks";
import { useRegistrationFlowStore } from "../../../shared/store/registrationFlowStore";
import { User, Calendar, MapPin, CheckCircle2 } from "lucide-react";

const registrationSchema = z.object({
  patient_name: z.string().min(1, "Nama pasien wajib diisi"),
  patient_nik: z.string().length(16, "NIK harus 16 digit"),
  patient_phone: z.string().min(10, "Nomor HP minimal 10 digit"),
  complaint: z.string().max(500, "Keluhan maksimal 500 karakter").optional(),
  arrival_method: z.enum(["datang_langsung", "di_jemput"]),
  consent: z.boolean().refine((val) => val === true, {
    message: "Wajib menyetujui persetujuan data",
  }),
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;

export function RegistrationForm() {
  const navigate = useNavigate();
  const { setRegistrationResult, clearPendingSelection, patient, pendingSelection } = useRegistrationFlowStore();

  const isDisabled = !pendingSelection;

  const submitMutation = useSubmitRegistration();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    setError,
    clearErrors,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      arrival_method: "datang_langsung",
      consent: false,
    },
    mode: "onBlur",
  });

  // Auto-fill patient data when patient prop changes
  useEffect(() => {
    if (patient) {
      setValue("patient_name", patient.name, { shouldValidate: true });
      setValue("patient_nik", patient.nik, { shouldValidate: true });
      setValue("patient_phone", patient.phone, { shouldValidate: true });
    }
  }, [patient, setValue]);

  const watchedConsent = watch("consent");
  const isFormValid = !errors.consent && watchedConsent;

  const formatDateForApi = (dateStr: string): string => {
    return dateStr; // already in ISO format from pendingSelection
  };

  const onSubmit = async (data: RegistrationFormData) => {
    clearErrors();

    if (!patient || !pendingSelection) return;

    try {
      await submitMutation.mutateAsync({
        patient_id: patient.id,
        poli_id: pendingSelection.poliId,
        doctor_id: pendingSelection.doctorId,
        date: formatDateForApi(pendingSelection.date),
        complaint: data.complaint || "",
        arrival_method: data.arrival_method,
      });
    } catch (err: any) {
      // Handle 422 validation errors from Laravel
      if (err.errors) {
        Object.entries(err.errors).forEach(([field, messages]) => {
          const message = Array.isArray(messages) ? messages[0] : messages;
          // Map backend field names to form field names
          const fieldMap: Record<string, string> = {
            patient_id: "patient_name",
            poli_id: "patient_name",
            doctor_id: "patient_name",
            date: "patient_name",
            complaint: "complaint",
            arrival_method: "arrival_method",
          };
          const formField = fieldMap[field] || field;
          setError(formField as keyof RegistrationFormData, {
            type: "server",
            message: String(message),
          });
        });
      } else {
        // Network error or 500 - will be caught by ErrorState
        throw err;
      }
    }
  };

  // Handle successful submission (mutation onSuccess)
  useEffect(() => {
    if (submitMutation.isSuccess && submitMutation.data?.data) {
      const result = submitMutation.data.data;
      setRegistrationResult({
        registration_id: result.registration_id,
        queue_number: result.queue_number,
        status: result.status,
        estimated_wait_minutes: result.estimated_wait_minutes,
        queue_position: result.queue_position,
      });
      clearPendingSelection();
      navigate(`/status/${result.registration_id}`);
    }
  }, [submitMutation.isSuccess, submitMutation.data, setRegistrationResult, clearPendingSelection, navigate]);

  // Show ErrorState for network/500 errors
  const showErrorState = submitMutation.isError && !submitMutation.error?.message?.includes("validation");

  return (
    <motion.div
      id="registration-form"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-8"
    >
      {/* Summary Chip */}
      {!isDisabled && pendingSelection && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-4 rounded-input"
          style={{ backgroundColor: "var(--color-primary-light)", border: "1px solid var(--color-primary)" }}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>Ringkasan:</span>
            <Badge status="info" className="px-3 py-1">
              {pendingSelection.poliName}
            </Badge>
            <Badge status="info" className="px-3 py-1">
              {pendingSelection.doctorName}
            </Badge>
            <Badge status="info" className="px-3 py-1">
              {formatDateDisplay(pendingSelection.date)} · {pendingSelection.practiceHours}
            </Badge>
          </div>
        </motion.div>
      )}

      {/* Form Card */}
      <Card variant="default" className="p-6">
        <h3 className="text-xl font-semibold mb-6" style={{ color: "var(--color-text-primary)" }}>
          Form Pendaftaran
        </h3>

        {isDisabled ? (
          <div className="text-center py-8">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "var(--color-primary-light)" }}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "var(--color-primary)" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h4 className="text-lg font-medium mb-2" style={{ color: "var(--color-text-primary)" }}>
              Belum Ada Jadwal Terpilih
            </h4>
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
              Silakan pilih jadwal dokter di halaman Detail Poli terlebih dahulu
            </p>
            <Button variant="secondary" size="md" className="mt-4" onClick={() => window.location.href = "/poli"}>
              Pilih Poli
            </Button>
          </div>
        ) : (
          <>
            {showErrorState && (
              <ErrorState
                message={submitMutation.error?.message || "Terjadi kesalahan jaringan. Silakan coba lagi."}
                onRetry={() => submitMutation.reset()}
                retryLabel="Coba Lagi"
                className="mb-6"
              />
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Patient Data (Auto-filled, Read-only) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Nama Lengkap"
                  disabled
                  leadingIcon={<User className="w-5 h-5" />}
                  {...register("patient_name")}
                />
                <Input
                  label="NIK"
                  disabled
                  leadingIcon={<Calendar className="w-5 h-5" />}
                  {...register("patient_nik")}
                />
                <Input
                  label="Nomor HP"
                  disabled
                  type="tel"
                  leadingIcon={<MapPin className="w-5 h-5" />}
                  {...register("patient_phone")}
                />
              </div>

              {/* Complaint */}
              <div>
                <label className="block text-label mb-2 uppercase" style={{ color: "var(--color-text-primary)" }}>
                  Keluhan / Catatan <span style={{ color: "var(--color-text-secondary)" }}> (opsional)</span>
                </label>
                <textarea
                  {...register("complaint")}
                  rows={3}
                  className="w-full px-4 py-3 bg-surface border-2 rounded-input text-body text-text-primary placeholder:text-text-secondary transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 resize-none"
                  placeholder="Tulis keluhan singkat atau catatan untuk dokter..."
                  style={{ fontFamily: "inherit" }}
                />
                {errors.complaint && (
                  <p className="mt-2 text-sm" style={{ color: "var(--color-danger)" }}>
                    {errors.complaint.message}
                  </p>
                )}
                <p className="mt-1 text-xs text-right" style={{ color: "var(--color-text-secondary)" }}>
                  {watch("complaint")?.length || 0}/500 karakter
                </p>
              </div>

              {/* Arrival Method */}
              <div>
                <label className="block text-label mb-2 uppercase" style={{ color: "var(--color-text-primary)" }}>
                  Metode Kedatangan
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className="flex items-center gap-2 p-4 border-2 rounded-input cursor-pointer transition-all"
                    style={{
                      borderColor: "var(--color-border)",
                      backgroundColor: "var(--color-surface)",
                    }}
                  >
                    <input
                      type="radio"
                      value="datang_langsung"
                      {...register("arrival_method")}
                      className="w-4 h-4 accent-primary"
                    />
                    <div>
                      <span className="font-medium" style={{ color: "var(--color-text-primary)" }}>Datang Langsung</span>
                      <p className="text-xs mt-1" style={{ color: "var(--color-text-secondary)" }}>Kunjungi rumah sakit sendiri</p>
                    </div>
                  </label>
                  <label
                    className="flex items-center gap-2 p-4 border-2 rounded-input cursor-pointer transition-all"
                    style={{
                      borderColor: "var(--color-border)",
                      backgroundColor: "var(--color-surface)",
                    }}
                  >
                    <input
                      type="radio"
                      value="di_jemput"
                      {...register("arrival_method")}
                      className="w-4 h-4 accent-primary"
                    />
                    <div>
                      <span className="font-medium" style={{ color: "var(--color-text-primary)" }}>Dijemput</span>
                      <p className="text-xs mt-1" style={{ color: "var(--color-text-secondary)" }}>Butuh jemputan ambulans/transport</p>
                    </div>
                  </label>
                </div>
                {errors.arrival_method && (
                  <p className="mt-2 text-sm" style={{ color: "var(--color-danger)" }}>
                    {errors.arrival_method.message}
                  </p>
                )}
              </div>

              {/* Consent Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("consent")}
                    className="w-5 h-5 mt-0.5 accent-primary rounded border-2"
                    style={{ borderColor: "var(--color-border)" }}
                  />
                  <div className="text-sm" style={{ color: "var(--color-text-primary)", lineHeight: 1.5 }}>
                    Saya menyetujui pengumpulan dan pengolahan data pribadi saya sesuai dengan
                    <span className="underline hover:no-underline" style={{ color: "var(--color-primary)" }}>
                      Kebijakan Privasi
                    </span>
                    dan
                    <span className="underline hover:no-underline" style={{ color: "var(--color-primary)" }}>
                      Syarat & Ketentuan
                    </span>
                    .
                  </div>
                </label>
                {errors.consent && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm flex items-center gap-1"
                    style={{ color: "var(--color-danger)" }}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {errors.consent.message}
                  </motion.p>
                )}
              </div>

              {/* Submit Button - sticky on mobile */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={submitMutation.isPending}
                disabled={!isFormValid || submitMutation.isPending}
                className="sticky bottom-0 md:static"
                style={{
                  zIndex: 10,
                  marginTop: "auto",
                }}
              >
                Konfirmasi Pendaftaran
              </Button>
            </form>
          </>
        )}
      </Card>
    </motion.div>
  );
}

function formatDateDisplay(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}