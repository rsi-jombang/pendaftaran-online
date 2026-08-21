import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Input } from "../../../shared/components/ui/Input";
import { Button } from "../../../shared/components/ui/Button";
import { User, Calendar, MapPin, Phone } from "lucide-react";

const newPatientSchema = z.object({
  nik: z.string().length(16, "NIK harus 16 digit"),
  name: z.string().min(3, "Nama minimal 3 karakter").max(100, "Nama maksimal 100 karakter"),
  birth_date: z.string().min(1, "Tanggal lahir wajib diisi"),
  gender: z.enum(["male", "female"]),
  address: z.string().min(10, "Alamat minimal 10 karakter").max(200, "Alamat maksimal 200 karakter"),
  phone: z
    .string()
    .min(10, "Nomor HP minimal 10 digit")
    .max(15, "Nomor HP maksimal 15 digit")
    .regex(/^[0-9]+$/, "Nomor HP hanya boleh berisi angka"),
});

export type NewPatientFormData = z.infer<typeof newPatientSchema>;

interface NewPatientFormProps {
  nik: string;
  onSubmit: (data: NewPatientFormData) => void;
  isLoading?: boolean;
  error?: string;
  onCancel: () => void;
}

export function NewPatientForm({ nik, onSubmit, isLoading = false, error, onCancel }: NewPatientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPatientFormData>({
    resolver: zodResolver(newPatientSchema),
    defaultValues: {
      nik,
      gender: "male" as const,
    },
    mode: "onBlur",
  });

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 mt-6"
    >
      {/* Info Header */}
      <div
        className="flex flex-col items-center gap-4 p-6 rounded-card"
        style={{ backgroundColor: "rgba(245, 166, 35, 0.1)" }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "rgba(245, 166, 35, 0.2)" }}
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ color: "var(--color-warning)", strokeWidth: 2 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-1" style={{ color: "var(--color-text-primary)" }}>
            NIK Belum Terdaftar
          </h3>
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
            Lengkapi data di bawah untuk mendaftar sebagai pasien baru
          </p>
        </div>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="NIK"
          type="text"
          disabled
          value={nik}
          leadingIcon={<User className="w-5 h-5" />}
        />

        <Input
          label="Nama Lengkap"
          placeholder="Masukkan nama lengkap"
          error={errors.name?.message}
          leadingIcon={<User className="w-5 h-5" />}
          {...register("name")}
        />

        <Input
          label="Tanggal Lahir"
          type="date"
          error={errors.birth_date?.message}
          leadingIcon={<Calendar className="w-5 h-5" />}
          max={new Date().toISOString().split("T")[0]}
          {...register("birth_date")}
        />

        <div>
          <label className="block text-label mb-2 uppercase" style={{ color: "var(--color-text-primary)" }}>
            Jenis Kelamin
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label
              className="flex items-center gap-2 p-3 border-2 rounded-input cursor-pointer transition-all"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-surface)",
              }}
            >
              <input
                type="radio"
                value="male"
                {...register("gender")}
                className="w-4 h-4 accent-primary"
              />
              <span style={{ color: "var(--color-text-primary)" }}>Laki-laki</span>
            </label>
            <label
              className="flex items-center gap-2 p-3 border-2 rounded-input cursor-pointer transition-all"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-surface)",
              }}
            >
              <input
                type="radio"
                value="female"
                {...register("gender")}
                className="w-4 h-4 accent-primary"
              />
              <span style={{ color: "var(--color-text-primary)" }}>Perempuan</span>
            </label>
          </div>
          {errors.gender && (
            <p className="mt-2 text-sm" style={{ color: "var(--color-danger)" }}>
              {errors.gender.message}
            </p>
          )}
        </div>

        <Input
          label="Alamat Lengkap"
          placeholder="Jl. Contoh No. 123, Kota"
          error={errors.address?.message}
          leadingIcon={<MapPin className="w-5 h-5" />}
          {...register("address")}
        />

        <Input
          label="Nomor HP"
          type="tel"
          placeholder="081234567890"
          error={errors.phone?.message}
          leadingIcon={<Phone className="w-5 h-5" />}
          inputMode="numeric"
          {...register("phone")}
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

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            fullWidth
            onClick={onCancel}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button type="submit" variant="primary" size="lg" fullWidth loading={isLoading}>
            Daftar Pasien Baru
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
