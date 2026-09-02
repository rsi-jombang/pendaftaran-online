import { create } from "zustand";

// Tipe data kontrak API (diisi saat Fase fitur terkait)
export interface PatientData {
  id: string;
  nik: string;
  name: string;
  birth_date: string;
  gender: "male" | "female";
  phone: string;
  address?: string;
}

export interface Poli {
  id: string;
  name: string;
  category: string;
  icon: string;
  doctors_today: number;
  quota_remaining: number;
  quota_status: "available" | "full";
}

export interface Doctor {
  id: string;
  name: string;
  avatar_url?: string;
  practice_hours: string;
  quota_remaining: number;
  quota_status: "available" | "full";
}

export interface RegistrationResult {
  registration_id: string;
  queue_number: string;
  status: "waiting" | "in_service" | "done";
  estimated_wait_minutes: number;
  queue_position: number;
}

export interface PendingSelection {
  poliId: string;
  poliName: string;
  jadwalId: number;
  doctorId: string;
  doctorName: string;
  date: string;
  practiceHours: string;
}

interface RegistrationFlowState {
  nik: string | null;
  patient: PatientData | null;
  pendingSelection: PendingSelection | null;
  registrationResult: RegistrationResult | null;

  setPatient: (patient: PatientData) => void;
  setPendingSelection: (selection: PendingSelection) => void;
  clearPendingSelection: () => void;
  setRegistrationResult: (result: RegistrationResult) => void;
  reset: () => void;
}

export const useRegistrationFlowStore = create<RegistrationFlowState>()((set) => ({
  nik: null,
  patient: null,
  pendingSelection: null,
  registrationResult: null,

  setPatient: (patient) => set({ patient, nik: patient.nik }),
  setPendingSelection: (selection) => set({ pendingSelection: selection }),
  clearPendingSelection: () => set({ pendingSelection: null }),
  setRegistrationResult: (result) => set({ registrationResult: result }),
  reset: () =>
    set({
      nik: null,
      patient: null,
      pendingSelection: null,
      registrationResult: null,
    }),
}));