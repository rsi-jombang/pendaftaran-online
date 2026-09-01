import { api } from "../../shared/lib/axios";
import type { CheckNikRequest, CheckNikResponse, RegisterPatientRequest, RegisterPatientResponse } from "./types";

export async function checkNik(request: CheckNikRequest): Promise<CheckNikResponse> {
  const response = await api.post<CheckNikResponse>("/v1/patients/check-nik", request);
  return response.data;
}

export async function registerPatient(request: RegisterPatientRequest): Promise<RegisterPatientResponse> {
  const response = await api.post<RegisterPatientResponse>("/v1/patients", request);
  return response.data;
}
