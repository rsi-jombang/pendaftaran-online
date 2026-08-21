import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text-primary)" }}>
          Masukkan NIK Anda
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
          Nomor Induk Kependudukan 16 digit
        </p>
      </div>

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

      {error && (
        <div 
          className="p-3 rounded-input text-sm text-center"
          style={{ backgroundColor: "rgba(229, 72, 77, 0.1)", color: "var(--color-danger)" }}
          role="alert"
        >
          {error}
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={isLoading}
        disabled={!isFormValid || isLoading}
      >
        Cek NIK
      </Button>

      <p className="text-center text-sm" style={{ color: "var(--color-text-secondary)" }}>
        Butuh bantuan? <a href="tel:02112345678" className="underline hover:no-underline" style={{ color: "var(--color-primary)" }}>Hubungi Admin</a>
      </p>
    </form>
  );
}