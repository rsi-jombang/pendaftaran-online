export interface RegistrationPayload {
  patient_id: number;
  patient_nik: string;
  poli_id: string;
  kodePoli: string;
  jadwal_id: number;
  doctor_id: string;
  doctorName: string;
  poliName: string;
  practiceHours: string;
  date: string;
  payment_method: "umum" | "asuransi" | "rekanan";
  insurance_id?: string;
  company_id?: string;
  responsible_name?: string;
  responsible_phone?: string;
}

export interface RegistrationResult {
  registration_id: string;
  queue_number: string;
  status: "waiting" | "in_service" | "done";
  queue_position: number;
  estimated_wait_minutes: number | null;
  is_bpjs: boolean;
  patient: { name: string; nik_masked: string };
  poli: { name: string };
  doctor: { name: string };
  schedule: { date: string; practice_hours: string };
}

export interface RegistrationResponseData {
  data: RegistrationResult;
  message?: string;
}
