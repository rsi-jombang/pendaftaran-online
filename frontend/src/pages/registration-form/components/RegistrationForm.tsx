import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Card } from "../../../shared/components/ui/Card";
import { Input } from "../../../shared/components/ui/Input";
import { SearchableSelect } from "../../../shared/components/ui";
import { Button } from "../../../shared/components/ui/Button";
import { ErrorState } from "../../../shared/components/feedback/ErrorState";
import { useSubmitRegistration } from "../../../features/registration/hooks";
import { useRegistrationFlowStore } from "../../../shared/store/registrationFlowStore";
import { useAsuransi, usePerusahaan } from "../../../features/master";
import { User, CreditCard, Phone, AlertCircle, UserCheck } from "lucide-react";

const registrationSchema = z.object({
  patient_name: z.string().min(1, "Nama pasien wajib diisi"),
  patient_nik: z.string().length(16, "NIK harus 16 digit"),
  patient_phone: z.string().min(10, "Nomor HP minimal 10 digit"),
  payment_method: z.enum(["umum", "asuransi", "rekanan"]),
  insurance_id: z.string().optional(),
  company_id: z.string().optional(),
  responsible_name: z.string().optional(),
  responsible_phone: z.string().optional(),
  consent: z.boolean().refine((val) => val === true, {
    message: "Wajib menyetujui persetujuan data",
  }),
}).refine(
  (data) => {
    if (data.payment_method === "asuransi") return !!data.insurance_id;
    if (data.payment_method === "rekanan") return !!data.company_id;
    return true;
  },
  {
    message: "Wajib memilih asuransi atau perusahaan yang sesuai",
    path: ["insurance_id"],
  }
);

export type RegistrationFormData = z.infer<typeof registrationSchema>;

export function RegistrationForm() {
  const navigate = useNavigate();
  const { setRegistrationResult, clearPendingSelection, patient, pendingSelection } =
    useRegistrationFlowStore();

  const isDisabled = !pendingSelection;

  const submitMutation = useSubmitRegistration();

  const asuransiQuery = useAsuransi();
  const perusahaanQuery = usePerusahaan();

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
      payment_method: "umum",
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
  const watchedPaymentMethod = watch("payment_method");
  const isFormValid = !errors.consent && watchedConsent;

  // Reset insurance_id when payment_method changes to non-asuransi
  // Reset company_id when payment_method changes to non-rekanan
  useEffect(() => {
    if (watchedPaymentMethod !== "asuransi") {
      setValue("insurance_id", "", { shouldValidate: true });
    }
    if (watchedPaymentMethod !== "rekanan") {
      setValue("company_id", "", { shouldValidate: true });
    }
  }, [watchedPaymentMethod, setValue]);

  const formatDateForApi = (dateStr: string): string => {
    return dateStr; // already in ISO format from pendingSelection
  };

  const onSubmit = async (data: RegistrationFormData) => {
    console.log("Submitting registration with data:", data);
    console.log("Pending selection:", pendingSelection);
    clearErrors();

    if (!patient || !pendingSelection) return;

    try {
      await submitMutation.mutateAsync({
        patient_id: patient.id,
        poli_id: pendingSelection.poliId,
        jadwal_id: pendingSelection.jadwalId,
        doctor_id: pendingSelection.doctorId,
        doctorName: pendingSelection.doctorName,
        poliName: pendingSelection.poliName,
        practiceHours: pendingSelection.practiceHours,
        date: formatDateForApi(pendingSelection.date),
        payment_method: data.payment_method,
        insurance_id: data.insurance_id || undefined,
        company_id: data.company_id || undefined,
        responsible_name: data.responsible_name || undefined,
        responsible_phone: data.responsible_phone || undefined,
      });
    } catch (err: any) {
      if (err.errors) {
        Object.entries(err.errors).forEach(([field, messages]) => {
          const message = Array.isArray(messages) ? messages[0] : messages;
          const fieldMap: Record<string, string> = {
            patient_id: "patient_name",
            poli_id: "patient_name",
            doctor_id: "patient_name",
            date: "patient_name",
            payment_method: "payment_method",
            insurance_id: "insurance_id",
            company_id: "company_id",
            responsible_name: "responsible_name",
            responsible_phone: "responsible_phone",
          };
          const formField = fieldMap[field] || field;
          setError(formField as keyof RegistrationFormData, {
            type: "server",
            message: String(message),
          });
        });
      } else {
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
  }, [
    submitMutation.isSuccess,
    submitMutation.data,
    setRegistrationResult,
    clearPendingSelection,
    navigate,
  ]);

  // Show ErrorState for network/500 errors
  const showErrorState =
    submitMutation.isError && !submitMutation.error?.message?.includes("validation");

  return (
    <motion.div
      id="registration-form"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {/* Form Card */}
      <Card variant="default" className="overflow-hidden p-0">
        {/* Card header */}
        <div className="border-b px-6 py-4" style={{ borderColor: "var(--c-border)" }}>
          <h3 className="text-body font-semibold" style={{ color: "var(--c-text)" }}>
            Data Pendaftaran
          </h3>
          <p className="mt-0.5 text-xs" style={{ color: "var(--c-text-muted)" }}>
            Lengkapi form di bawah ini
          </p>
        </div>

        {isDisabled ? (
          <div className="px-6 py-12 text-center">
            <div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: "var(--c-primary-soft)" }}
            >
              <AlertCircle className="h-8 w-8" style={{ color: "var(--c-primary)" }} />
            </div>
            <h4 className="mb-2 text-lg font-medium" style={{ color: "var(--c-text)" }}>
              Belum Ada Jadwal Terpilih
            </h4>
            <p className="text-sm" style={{ color: "var(--c-text-muted)" }}>
              Silakan pilih jadwal dokter di halaman Detail Poli terlebih dahulu
            </p>
            <Button
              variant="secondary"
              size="md"
              className="mt-4"
              onClick={() => navigate("/poli")}
            >
              Pilih Poli
            </Button>
          </div>
        ) : (
          <div className="p-6">
            {showErrorState && (
              <ErrorState
                message={
                  submitMutation.error?.message ||
                  "Terjadi kesalahan jaringan. Silakan coba lagi."
                }
                onRetry={() => submitMutation.reset()}
                retryLabel="Coba Lagi"
                className="mb-6"
              />
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Patient Data (Auto-filled, Read-only) */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Input
                  label="Nama Lengkap"
                  disabled
                  leadingIcon={<User className="h-4 w-4" />}
                  {...register("patient_name")}
                />
                <Input
                  label="NIK"
                  disabled
                  leadingIcon={<CreditCard className="h-4 w-4" />}
                  {...register("patient_nik")}
                />
                <Input
                  label="Nomor HP"
                  disabled
                  type="tel"
                  leadingIcon={<Phone className="h-4 w-4" />}
                  {...register("patient_phone")}
                />
              </div>

              {/* Payment Method */}
              <div>
                <label
                  className="mb-3 block text-label uppercase"
                  style={{ color: "var(--c-text)" }}
                >
                  Pembayaran
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(["umum", "asuransi", "rekanan"] as const).map((method) => (
                    <label
                      key={method}
                      className="flex cursor-pointer items-center gap-3 rounded-input border-2 p-4 transition-all"
                      style={{
                        borderColor: watchedPaymentMethod === method ? "var(--c-primary)" : "var(--c-border)",
                        backgroundColor: watchedPaymentMethod === method ? "var(--c-primary-soft)" : "var(--c-surface)",
                      }}
                    >
                      <input
                        type="radio"
                        value={method}
                        {...register("payment_method")}
                        className="h-4 w-4 accent-[var(--c-primary)]"
                      />
                      <div>
                        <span className="text-small font-medium capitalize" style={{ color: "var(--c-text)" }}>
                          {method}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.payment_method && (
                  <p className="mt-2 text-sm" style={{ color: "var(--c-danger)" }}>
                    {errors.payment_method.message}
                  </p>
                )}
              </div>

              {/* Asuransi & Perusahaan (conditional) */}
              {watchedPaymentMethod !== "umum" && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {watchedPaymentMethod === "asuransi" && (
                    <SearchableSelect
                      label="Asuransi"
                      options={(asuransiQuery.data?.data ?? []).map((item) => ({ value: String(item.id), label: item.nama }))}
                      value={watch("insurance_id") || ""}
                      onChange={(value) => setValue("insurance_id", value, { shouldValidate: true })}
                      loading={asuransiQuery.isLoading}
                      placeholder="Pilih asuransi"
                      searchPlaceholder="Cari asuransi..."
                      error={errors.insurance_id?.message}
                    />
                  )}
                  {watchedPaymentMethod === "rekanan" && (
                    <SearchableSelect
                      label="Perusahaan"
                      options={(perusahaanQuery.data?.data ?? []).map((item) => ({ value: String(item.id), label: item.nama }))}
                      value={watch("company_id") || ""}
                      onChange={(value) => setValue("company_id", value, { shouldValidate: true })}
                      loading={perusahaanQuery.isLoading}
                      placeholder="Pilih perusahaan"
                      searchPlaceholder="Cari perusahaan..."
                      error={errors.company_id?.message}
                    />
                  )}
                </div>
              )}

              {/* Penanggung Jawab */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  label="Nama Penanggung Jawab"
                  placeholder="Nama lengkap penanggung jawab"
                  leadingIcon={<UserCheck className="h-4 w-4" />}
                  {...register("responsible_name")}
                  error={errors.responsible_name?.message}
                />
                <Input
                  label="Telp Penanggung Jawab"
                  type="tel"
                  placeholder="081234567890"
                  leadingIcon={<Phone className="h-4 w-4" />}
                  {...register("responsible_phone")}
                  error={errors.responsible_phone?.message}
                />
              </div>

              {/* Consent Checkbox */}
              <div className="pt-2">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    {...register("consent")}
                    className="mt-0.5 h-5 w-5 rounded border-2 accent-[var(--c-primary)]"
                    style={{ borderColor: "var(--c-border)" }}
                  />
                  <div className="text-sm leading-relaxed" style={{ color: "var(--c-text)" }}>
                    Saya menyetujui pengumpulan dan pengolahan data pribadi saya sesuai dengan{" "}
                    <span className="font-medium underline hover:no-underline" style={{ color: "var(--c-primary)" }}>
                      Kebijakan Privasi
                    </span>{" "}
                    dan{" "}
                    <span className="font-medium underline hover:no-underline" style={{ color: "var(--c-primary)" }}>
                      Syarat & Ketentuan
                    </span>
                    .
                  </div>
                </label>
                {errors.consent && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 flex items-center gap-1 text-sm"
                    style={{ color: "var(--c-danger)" }}
                  >
                    <AlertCircle className="h-4 w-4" />
                    {errors.consent.message}
                  </motion.p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  fullWidth
                  loading={submitMutation.isPending}
                  disabled={!isFormValid || submitMutation.isPending}
                  className="sticky bottom-4 md:static"
                >
                  Konfirmasi Pendaftaran
                </Button>
              </div>
            </form>
          </div>
        )}
      </Card>
    </motion.div>
  );
}