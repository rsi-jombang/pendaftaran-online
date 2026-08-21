import type { QueueStatusResponse } from "./types";

// TODO: replace mock — waiting for real endpoint from backend

export const mockQueueStatusWaiting: QueueStatusResponse = {
  data: {
    registration_id: "REG-20260820-014",
    queue_number: "A-014",
    status: "waiting",
    queue_position: 3,
    estimated_wait_minutes: 20,
    patient: {
      name: "Siti Aminah",
      nik_masked: "35xxxxxxxxxx0001",
    },
    poli: {
      name: "Poli Anak",
    },
    doctor: {
      name: "dr. Sarah Wijaya, Sp.A",
    },
    schedule: {
      date: "2026-08-20",
      practice_hours: "09:00-12:00",
    },
  },
};

export const mockQueueStatusInService: QueueStatusResponse = {
  data: {
    ...mockQueueStatusWaiting.data,
    status: "in_service",
    queue_position: 0,
    estimated_wait_minutes: 0,
  },
};

export const mockQueueStatusDone: QueueStatusResponse = {
  data: {
    ...mockQueueStatusWaiting.data,
    status: "done",
    queue_position: 0,
    estimated_wait_minutes: 0,
  },
};