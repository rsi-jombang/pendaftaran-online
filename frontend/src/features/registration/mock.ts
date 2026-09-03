import type { RegistrationResponseData } from "./types";

// TODO: replace mock — waiting for real endpoint from backend

export const mockRegistrationSuccess: RegistrationResponseData = {
  data: {
    registration_id: "REG-20260820-014",
    queue_number: "A-014",
    status: "waiting",
    estimated_wait_minutes: 25,
    queue_position: 4,
    is_bpjs: false,
    patient: { name: "Siti Aminah", nik_masked: "35xxxxxxxxxx0001" },
    poli: { name: "Poli Anak" },
    doctor: { name: "dr. Sarah Wijaya, Sp.A" },
    schedule: { date: "2026-08-20", practice_hours: "09:00-12:00" },
  },
  message: "Pendaftaran berhasil",
};