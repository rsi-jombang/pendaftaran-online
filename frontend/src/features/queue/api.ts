import { api } from "../../shared/lib/axios";
import type { QueueStatusResponse } from "./types";

export async function getQueueStatus(registrationId: string): Promise<QueueStatusResponse> {
  const response = await api.get<QueueStatusResponse>(`/registrations/${registrationId}`);
  return response.data;
}
