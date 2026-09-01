import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Input } from "../../../shared/components/ui/Input";
import { Select } from "../../../shared/components/ui/Select";
import { Button } from "../../../shared/components/ui/Button";
import {
  User,
  Calendar,
  MapPin,
  Phone,
  Map,
  Briefcase,
  GraduationCap,
  Church,
} from "lucide-react";
import { useProvinsi, useKabupaten, useAllKabupaten, useKecamatan, useKelurahan } from "../../../features/master";
import type { MasterRegionItem } from "../../../features/master";

// Tanggal hari ini dalam waktu lokal (bukan UTC)
const todayLocal = format(new Date(), "yyyy-MM-dd");

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
  sebutan: z.string().optional(),
  birth_place: z.string().min(1, "Tempat lahir wajib dipilih"),
  province_id: z.string().min(1, "Provinsi wajib dipilih"),
  district_id: z.string().min(1, "Kabupaten wajib dipilih"),
  subdistrict_id: z.string().min(1, "Kecamatan wajib dipilih"),
  village_id: z.string().min(1, "Kelurahan wajib dipilih"),
  occupation: z.string().optional(),
  education: z.string().optional(),
  religion: z.string().optional(),
});

export type NewPatientFormData = z.infer<typeof newPatientSchema>;

interface NewPatientFormProps {
  nik: string;
  onSubmit: (data: NewPatientFormData) => void;
  isLoading?: boolean;
  error?: string;
  onCancel: () => void;
}

const SEBUTAN_OPTIONS = ["An.", "Tn.", "Ny.", "Sdr."];
const EDUCATION_OPTIONS = [
  "Tidak Sekolah",
  "SD",
  "SMP",
  "SMA/SMK",
  "D1",
  "D2",
  "D3",
  "D4",
  "S1",
  "S2",
  "S3",
];
const RELIGION_OPTIONS = ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"];

function toOption(item: MasterRegionItem) {
  return { value: item.id, label: item.nama };
}

export function NewPatientForm({
  nik,
  onSubmit,
  isLoading = false,
  error,
  onCancel,
}: NewPatientFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<NewPatientFormData>({
    resolver: zodResolver(newPatientSchema),
    defaultValues: {
      nik,
      gender: "male" as const,
    },
    mode: "onBlur",
  });

  const provinceId = useWatch({ control, name: "province_id" });
  const districtId = useWatch({ control, name: "district_id" });
  const subdistrictId = useWatch({ control, name: "subdistrict_id" });

  const provinsiQuery = useProvinsi();
  const kabupatenQuery = useKabupaten(provinceId);
  const allKabupatenQuery = useAllKabupaten();
  const kecamatanQuery = useKecamatan(districtId, provinceId);
  const kelurahanQuery = useKelurahan(subdistrictId);

  const provinsiList = provinsiQuery.data?.data ?? [];
  const kabupatenList = kabupatenQuery.data?.data ?? [];
  const allKabupatenList = allKabupatenQuery.data?.data ?? [];
  const kecamatanList = kecamatanQuery.data?.data ?? [];
  const kelurahanList = kelurahanQuery.data?.data ?? [];

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setValue("province_id", val, { shouldValidate: true });
    setValue("district_id", "", { shouldValidate: true });
    setValue("district_name" as any, "");
    setValue("subdistrict_id", "", { shouldValidate: true });
    setValue("subdistrict_name" as any, "");
    setValue("village_id", "", { shouldValidate: true });
    setValue("village_name" as any, "");
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setValue("district_id", val, { shouldValidate: true });
    const name = kabupatenList.find((k) => k.id === val)?.nama ?? "";
    setValue("district_name" as any, name);
    setValue("subdistrict_id", "", { shouldValidate: true });
    setValue("subdistrict_name" as any, "");
    setValue("village_id", "", { shouldValidate: true });
    setValue("village_name" as any, "");
  };

  const handleSubdistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setValue("subdistrict_id", val, { shouldValidate: true });
    const name = kecamatanList.find((k) => k.id === val)?.nama ?? "";
    setValue("subdistrict_name" as any, name);
    setValue("village_id", "", { shouldValidate: true });
    setValue("village_name" as any, "");
  };

  const handleVillageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setValue("village_id", val, { shouldValidate: true });
    const name = kelurahanList.find((k) => k.id === val)?.nama ?? "";
    setValue("village_name" as any, name);
  };

  const handleSubmitWrapper = (data: NewPatientFormData) => {
    onSubmit({
      ...data,
      province_name: provinsiList.find((p) => p.id === data.province_id)?.nama ?? "",
      district_name:
        kabupatenList.find((k) => k.id === data.district_id)?.nama ?? "",
      subdistrict_name:
        kecamatanList.find((k) => k.id === data.subdistrict_id)?.nama ?? "",
      village_name:
        kelurahanList.find((k) => k.id === data.village_id)?.nama ?? "",
    } as NewPatientFormData);
  };

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
        style={{ backgroundColor: "color-mix(in srgb, var(--color-warning) 10%, transparent)" }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "color-mix(in srgb, var(--color-warning) 20%, transparent)" }}
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
      <form onSubmit={handleSubmit(handleSubmitWrapper)} className="space-y-4">
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

        <Select
          label="Sebutan"
          options={SEBUTAN_OPTIONS.map((s) => ({ value: s, label: s }))}
          placeholder="Pilih sebutan..."
          error={errors.sebutan?.message}
          {...register("sebutan")}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Tanggal Lahir"
            type="date"
            error={errors.birth_date?.message}
            leadingIcon={<Calendar className="w-5 h-5" />}
            max={todayLocal}
            {...register("birth_date")}
          />

          <Select
            label="Tempat Lahir"
            options={allKabupatenList.map(toOption)}
            placeholder="Pilih kabupaten..."
            loading={allKabupatenQuery.isLoading}
            error={errors.birth_place?.message}
            leadingIcon={<MapPin className="w-5 h-5" />}
            {...register("birth_place")}
          />
        </div>

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

        {/* Wilayah/Alamat */}
        <div className="pt-2">
          <p className="flex items-center gap-2 text-label uppercase mb-3" style={{ color: "var(--color-text-primary)" }}>
            <Map className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
            Wilayah Domisili
          </p>

          <Select
            label="Provinsi"
            options={provinsiList.map(toOption)}
            loading={provinsiQuery.isLoading}
            placeholder={provinsiQuery.isLoading ? "Memuat..." : "Pilih provinsi"}
            error={errors.province_id?.message}
            {...register("province_id", { onChange: handleProvinceChange })}
          />

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Kabupaten"
              options={kabupatenList.map(toOption)}
              loading={kabupatenQuery.isLoading}
              placeholder={provinceId ? "Pilih kabupaten" : "Pilih provinsi dulu"}
              error={errors.district_id?.message}
              {...register("district_id", { onChange: handleDistrictChange })}
            />

            <Select
              label="Kecamatan"
              options={kecamatanList.map(toOption)}
              loading={kecamatanQuery.isLoading}
              placeholder={districtId ? "Pilih kecamatan" : "Pilih kabupaten dulu"}
              error={errors.subdistrict_id?.message}
              {...register("subdistrict_id", { onChange: handleSubdistrictChange })}
            />
          </div>

          <div className="mt-4">
            <Select
              label="Kelurahan"
              options={kelurahanList.map(toOption)}
              loading={kelurahanQuery.isLoading}
              placeholder={subdistrictId ? "Pilih kelurahan" : "Pilih kecamatan dulu"}
              error={errors.village_id?.message}
              {...register("village_id", { onChange: handleVillageChange })}
            />
          </div>

          <div className="mt-4">
            <Input
              label="Alamat Lengkap (Jalan, No. Rumah, RT/RW)"
              placeholder="Jl. Contoh No. 123, RT 01 RW 02"
              error={errors.address?.message}
              leadingIcon={<MapPin className="w-5 h-5" />}
              {...register("address")}
            />
          </div>
        </div>

        {/* Data Tambahan */}
        <div className="pt-2">
          <p className="flex items-center gap-2 text-label uppercase mb-3" style={{ color: "var(--color-text-primary)" }}>
            <Briefcase className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
            Data Tambahan
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input
              label="Pekerjaan"
              placeholder="Pekerjaan"
              leadingIcon={<Briefcase className="w-5 h-5" />}
              {...register("occupation")}
            />

            <Select
              label="Pendidikan"
              options={EDUCATION_OPTIONS.map((s) => ({ value: s, label: s }))}
              placeholder="Pilih pendidikan"
              leadingIcon={<GraduationCap className="w-5 h-5" />}
              {...register("education")}
            />

            <Select
              label="Agama"
              options={RELIGION_OPTIONS.map((s) => ({ value: s, label: s }))}
              placeholder="Pilih agama"
              leadingIcon={<Church className="w-5 h-5" />}
              {...register("religion")}
            />
          </div>
        </div>

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
            style={{ backgroundColor: "color-mix(in srgb, var(--color-danger) 10%, transparent)", color: "var(--color-danger)" }}
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
