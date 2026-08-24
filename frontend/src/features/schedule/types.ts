export type DoctorStatus = "BUKA" | "BELUM BUKA" | "TUTUP";
export type DoctorSource = "bpjs" | "non_bpjs";

export interface Doctor {
  id: string;
  name: string;
  avatar_url?: string;
  practice_hours: string;
  quota_remaining: number | null;
  quota_status: "available" | "full" | "unlimited";
  status: DoctorStatus;
  source: DoctorSource;
}

export interface SchedulePoli {
  id: string;
  name: string;
}

export interface ScheduleResponseData {
  poli: SchedulePoli;
  date: string;
  doctors: Doctor[];
}

export interface ScheduleResponse {
  data: ScheduleResponseData;
}