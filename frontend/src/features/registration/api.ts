// import { api } from "../../shared/lib/axios";
import type { RegistrationPayload, RegistrationResponseData } from "./types";

// TODO: replace mock — waiting for real endpoint from backend
export async function submitRegistration(_payload: RegistrationPayload): Promise<RegistrationResponseData> {
  // Uncomment when backend ready:
  // const response = await api.post<RegistrationResponseData>("/registrations", payload);
  // return response.data;

  // Mock response untuk development
  const { mockRegistrationSuccess } = await import("./mock");
  
  // Simulasi network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  return mockRegistrationSuccess;
}