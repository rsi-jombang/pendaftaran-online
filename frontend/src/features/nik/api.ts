// import { api } from "../../shared/lib/axios";
import type { CheckNikRequest, CheckNikResponse, RegisterPatientRequest, RegisterPatientResponse } from "./types";

// TODO: replace mock — waiting for real endpoint from backend
export async function checkNik(request: CheckNikRequest): Promise<CheckNikResponse> {
  // Uncomment when backend ready:
  // const response = await api.post<CheckNikResponse>("/patients/check-nik", request);
  // return response.data;

  // Mock response untuk development
  const { mockCheckNikFound, mockCheckNikNotFound } = await import("./mock");
  
  // Simulasi network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Demo: NIK "3578012345670001" = terdaftar, lainnya = tidak terdaftar
  if (request.nik === "3578012345670001") {
    return mockCheckNikFound;
  }
  return mockCheckNikNotFound;
}

// TODO: replace mock — waiting for real endpoint from backend
export async function registerPatient(request: RegisterPatientRequest): Promise<RegisterPatientResponse> {
  // Uncomment when backend ready:
  // const response = await api.post<RegisterPatientResponse>("/patients", request);
  // return response.data;

  // Mock response untuk development
  const { mockRegisterPatientSuccess } = await import("./mock");
  
  // Simulasi network delay
  await new Promise((resolve) => setTimeout(resolve, 1200));
  
  return mockRegisterPatientSuccess(request);
}