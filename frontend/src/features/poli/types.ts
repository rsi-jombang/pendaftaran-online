export interface Poli {
  id: string;
  name: string;
  category: string;
  icon: string;
  doctors_today: number;
  quota_remaining: number;
  quota_status: "available" | "full";
  description?: string;
}

export interface PoliListResponse {
  data: Poli[];
}

export interface PoliDetailResponse {
  data: Poli;
}

export interface Doctor {
  id: string;
  name: string;
  avatar_url?: string;
  practice_hours: string;
  quota_remaining: number;
  quota_status: "available" | "full";
}

export interface DoctorScheduleResponseData {
  poli: { id: string; name: string };
  date: string;
  doctors: Doctor[];
}

export interface DoctorScheduleResponse {
  data: DoctorScheduleResponseData;
}