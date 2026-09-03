import { api } from "../../shared/lib/axios";
import type { PoliListResponse, PoliDetailResponse, DoctorScheduleResponse } from "./types";

export async function getPoliList(todayOnly?: boolean): Promise<PoliListResponse> {
  const response = await api.get<PoliListResponse>("/v1/poli-data", {
    params: todayOnly ? { today: 1 } : undefined,
  });
  return response.data;
}

export async function getPoliDetail(slugPoli: string): Promise<PoliDetailResponse> {
  const response = await api.get<PoliDetailResponse>(`/v1/poli/${slugPoli}`);
  return response.data;
}

export async function getDoctorSchedule(slugPoli: string, date: string): Promise<DoctorScheduleResponse> {
  const response = await api.get<DoctorScheduleResponse>(`/v1/poli/${slugPoli}/schedules`, {
    params: { date },
  });
  return response.data;
}