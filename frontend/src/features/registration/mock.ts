import type { RegistrationResponseData } from "./types";

// TODO: replace mock — waiting for real endpoint from backend

export const mockRegistrationSuccess: RegistrationResponseData = {
  data: {
    registration_id: "REG-20260820-014",
    queue_number: "A-014",
    status: "waiting",
    estimated_wait_minutes: 25,
    queue_position: 4,
  },
  message: "Pendaftaran berhasil",
};