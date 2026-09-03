import type { QueueStatusResponse } from "./types";

// TODO: replace mock — waiting for real endpoint from backend

export const mockQueueStatusWaiting: QueueStatusResponse = {
  data: {
    registration_id: "URO20260903RANDOM01",
    queue_number: "URO-0001",
    status: "waiting",
    queue_position: 3,
    estimated_wait_minutes: null,
    is_bpjs: false,
    patient: {
      name: "Siti Aminah",
      nik_masked: "35xxxxxxxxxx0001",
    },
    poli: {
      name: "Poli Urologi",
    },
    doctor: {
      name: "dr. Fakhri Surahmad, Sp.U",
    },
    schedule: {
      date: "2026-09-03",
      practice_hours: "13:00-15:00",
    },
  },
};

export const mockQueueStatusInService: QueueStatusResponse = {
  data: {
    ...mockQueueStatusWaiting.data,
    status: "in_service",
    queue_position: 0,
  },
};

export const mockQueueStatusDone: QueueStatusResponse = {
  data: {
    ...mockQueueStatusWaiting.data,
    status: "done",
    queue_position: 0,
  },
};
