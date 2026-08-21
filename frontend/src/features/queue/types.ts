export interface RegistrationStatus {
  registration_id: string;
  queue_number: string;
  status: "waiting" | "in_service" | "done";
  queue_position: number;
  estimated_wait_minutes: number;
  patient: {
    name: string;
    nik_masked: string;
  };
  poli: {
    name: string;
  };
  doctor: {
    name: string;
  };
  schedule: {
    date: string;
    practice_hours: string;
  };
}

export interface QueueStatusResponse {
  data: RegistrationStatus;
}