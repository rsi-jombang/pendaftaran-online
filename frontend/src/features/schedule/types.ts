export interface Doctor {
  id: string;
  name: string;
  avatar_url?: string;
  practice_hours: string;
  quota_remaining: number;
  quota_status: "available" | "full";
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