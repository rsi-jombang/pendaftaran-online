import { api } from "../../shared/lib/axios";
import type { RegistrationPayload, RegistrationResponseData } from "./types";

export async function submitRegistration(payload: RegistrationPayload): Promise<RegistrationResponseData> {
  const response = await api.post<RegistrationResponseData>("/v1/registration", payload);
  return response.data;
}
