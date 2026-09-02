export interface Poli {
  id: string;
  slug_poli: string;
  name: string;
  nama_poli: string;
  category: string;
  icon: string;
  jumlah_dokter: number;
  jam_praktek: string;
  description?: string;
}

export interface PoliListResponse {
  success: boolean;
  message: string;
  data: Poli[];
}

export interface PoliDetailResponse {
  success: boolean;
  message: string;
  data: Poli;
}

export type DoctorSource = "bpjs" | "non_bpjs";

export interface Doctor {
  jadwal_id: number;
  id: string;
  name: string;
  avatar_url?: string;
  practice_hours: string;
  quota_remaining: number | null;
  quota_status: "available" | "full" | "unlimited";
  status: "BUKA" | "BELUM BUKA" | "TUTUP";
  source: "bpjs" | "non_bpjs";
}

export interface DoctorScheduleResponseData {
  poli: { id: string; name: string };
  date: string;
  doctors: Doctor[];
}

export interface DoctorScheduleResponse {
  data: DoctorScheduleResponseData;
}