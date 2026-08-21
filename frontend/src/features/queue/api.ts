// import { api } from "../../shared/lib/axios";
import type { QueueStatusResponse } from "./types";

// TODO: replace mock — waiting for real endpoint from backend
export async function getQueueStatus(_registrationId: string): Promise<QueueStatusResponse> {
  // Uncomment when backend ready:
  // const response = await api.get<QueueStatusResponse>(`/registrations/${registrationId}`);
  // return response.data;

  // Mock response untuk development
  const { mockQueueStatusWaiting } = await import("./mock");
  
  // Simulasi network delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  return mockQueueStatusWaiting;
}