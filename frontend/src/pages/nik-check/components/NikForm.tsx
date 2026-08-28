import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { Input } from "../../../shared/components/ui/Input";
import { Button } from "../../../shared/components/ui/Button";
import { CreditCard } from "lucide-react";

const nikSchema = z.object({
  nik: z
    .string()
    .min(16, "NIK harus 16 digit")
    .max(16, "NIK harus 16 digit")
    .regex(/^\d+$/, "NIK hanya boleh berisi angka"),
});

export type NikFormData = z.infer<typeof nikSchema>;

interface NikFormProps {
  onSubmit: (data: NikFormData) => void;
  isLoading?: boolean;
  error?: string;
}

export function NikForm({ onSubmit, isLoading = false, error }: NikFormProps) {
  const [nikState, setNikState] = useState<"default" | "success" | "error">("default");

  // Auto-focus saat mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const input = document.getElementById("nik") as HTMLInputElement | null;
      input?.focus();
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<NikFormData>({
    resolver: zodResolver(nikSchema),
    mode: "onChange",
  });

  const nikValue = watch("nik", "");
  const isFormValid = nikValue.length === 16 && !errors.nik;
  const digitCount = nikValue.length;

  // Reset error state saat user mulai mengetik
  useEffect(() => {
    if (nikValue.length > 0 && nikState === "error" && !errors.nik) {
      setNikState("default");
    }
  }, [nikValue, nikState, errors.nik]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold" style={{ color: "var(--c-text)" }}>
          Masukkan NIK Anda
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--c-text-muted)" }}>
          Nomor Induk Kependudukan 16 digit
        </p>
      </div>

      <div className="space-y-2">
        <div className="relative">
          <Input
            label="NIK"
            placeholder="3578012345670001"
            type="tel"
            maxLength={16}
            leadingIcon={<CreditCard className="w-5 h-5" />}
            state={nikState}
            error={errors.nik?.message}
            inputMode="numeric"
            autoComplete="off"
            {...register("nik")}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 16);
              setValue("nik", value, { shouldValidate: true });

              if (value.length === 16) {
                setNikState("success");
              } else if (value.length > 0 && value.length < 16) {
                setNikState("error");
              } else {
                setNikState("default");
              }
            }}
          />
        </div>

        {/* Digit counter */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs" style={{ color: "var(--c-text-muted)" }}>
            {digitCount > 0 && digitCount < 16
              ? `Masih kurang ${16 - digitCount} digit`
              : digitCount === 16
              ? "✓ Lengkap 16 digit"
              : "Masukkan 16 digit angka NIK"}
          </span>
          <span
            className="text-xs font-mono font-medium tabular-nums transition-colors"
            style={{
              color: isFormValid
                ? "var(--c-success)"
                : digitCount > 0
                ? "var(--c-danger)"
                : "var(--c-text-muted)",
            }}
          >
            {digitCount}/16
          </span>
        </div>
      </div>

      {error && (
        <div
          className="flex items-center gap-2 p-3 rounded-input text-sm text-center"
          style={{
            backgroundColor: "color-mix(in srgb, var(--c-danger) 10%, transparent)",
            color: "var(--c-danger)",
          }}
          role="alert"
        >
          <span>{error}</span>
        </div>
      )}

      <Button
        type="submit"
        variant="gradient"
        size="lg"
        fullWidth
        loading={isLoading}
        disabled={!isFormValid || isLoading}
      >
        Cek NIK
      </Button>

      <p className="text-center text-sm" style={{ color: "var(--c-text-muted)" }}>
        Butuh bantuan?{" "}
        <a
          href="tel:02112345678"
          className="font-medium underline hover:no-underline transition-colors"
          style={{ color: "var(--c-primary)" }}
        >
          Hubungi Admin
        </a>
      </p>
    </form>
  );
}