// import { api } from "../../shared/lib/axios";
import type { PoliListResponse, PoliDetailResponse, DoctorScheduleResponse } from "./types";

// TODO: replace mock — waiting for real endpoint from backend
// Sementara ini akan dipanggil tapi return mock data
export async function getPoliList(): Promise<PoliListResponse> {
  // Uncomment when backend ready:
  // const response = await api.get<PoliListResponse>("/poli");
  // return response.data;
  
  // Mock response untuk development
  const { mockPoliList } = await import("./mock");
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockPoliList), 800); // Simulasi network delay
  });
}

// TODO: replace mock — waiting for real endpoint from backend
export async function getPoliDetail(poliId: string): Promise<PoliDetailResponse> {
  // Uncomment when backend ready:
  // const response = await api.get<PoliDetailResponse>(`/poli/${poliId}`);
  // return response.data;

  // Mock response untuk development
  const { mockPoliDetail } = await import("./mock");
  
  // Simulasi network delay
  await new Promise((resolve) => setTimeout(resolve, 600));
  
  return mockPoliDetail[poliId] || mockPoliDetail["POLI-01"];
}

// TODO: replace mock — waiting for real endpoint from backend
export async function getDoctorSchedule(poliId: string, date: string): Promise<DoctorScheduleResponse> {
  // Uncomment when backend ready:
  // const response = await api.get<DoctorScheduleResponse>(`/poli/${poliId}/schedules`, { params: { date } });
  // return response.data;

  // Mock response untuk development
  const { mockDoctorSchedule } = await import("./mock");
  
  // Simulasi network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const key = `${poliId}-${date}`;
  return mockDoctorSchedule[key] || mockDoctorSchedule[`POLI-01-${date}`] || generateDefaultSchedule(poliId, date);
}

function generateDefaultSchedule(poliId: string, date: string): DoctorScheduleResponse {
  return {
    data: {
      poli: { id: poliId, name: "Poli" },
      date,
      doctors: [
        {
          id: "DOK-01",
          name: "dr. Dokter Utama",
          practice_hours: "08:00-12:00",
          quota_remaining: 10,
          quota_status: "available",
        },
      ],
    },
  };
}