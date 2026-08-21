import type { CheckNikResponse, RegisterPatientResponse } from "./types";

// TODO: replace mock — waiting for real endpoint from backend

// Mock response - NIK terdaftar
export const mockCheckNikFound: CheckNikResponse = {
  data: {
    found: true,
    patient: {
      id: "PAT-00123",
      nik: "3578012345670001",
      name: "Siti Aminah",
      birth_date: "1990-05-12",
      gender: "female",
      phone: "081234567890",
    },
  },
};

// Mock response - NIK belum terdaftar
export const mockCheckNikNotFound: CheckNikResponse = {
  data: {
    found: false,
    patient: null,
  },
};

// Mock response - Registrasi pasien baru berhasil
export const mockRegisterPatientSuccess = (request: any): RegisterPatientResponse => ({
  data: {
    id: `PAT-${Math.floor(Math.random() * 10000).toString().padStart(5, "0")}`,
    nik: request.nik,
    name: request.name,
    birth_date: request.birth_date,
    gender: request.gender,
    address: request.address,
    phone: request.phone,
  },
  message: "Pasien baru berhasil didaftarkan",
});