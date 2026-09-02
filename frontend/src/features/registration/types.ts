export interface RegistrationPayload {
  patient_id: string;
  poli_id: string;
  jadwal_id: number;
  doctor_id: string;
  doctorName: string;
  poliName: string;
  practiceHours: string;
  date: string; // ISO format YYYY-MM-DD
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
  estimated_wait_minutes: number;
  queue_position: number;
}

export interface RegistrationResponseData {
  data: RegistrationResult;
  message?: string;
}