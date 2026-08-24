import { api } from "../../shared/lib/axios";
import type { ScheduleResponse } from "./types";

export async function getDoctorSchedule(poliId: string, date: string): Promise<ScheduleResponse> {
  const response = await api.get<ScheduleResponse>(`/v1/poli/${poliId}/schedules`, {
    params: { date },
  });
  return response.data;
}