export interface RegistrationPayload {
  patient_id: string;
  poli_id: string;
  doctor_id: string;
  date: string; // ISO format YYYY-MM-DD
  complaint: string;
  arrival_method: "datang_langsung" | "di_jemput";
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