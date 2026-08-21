// import { api } from "../../shared/lib/axios";
import type { ScheduleResponse } from "./types";

// TODO: replace mock — waiting for real endpoint from backend
export async function getDoctorSchedule(poliId: string, date: string): Promise<ScheduleResponse> {
  // Uncomment when backend ready:
  // const response = await api.get<ScheduleResponse>(`/poli/${poliId}/schedules`, { params: { date } });
  // return response.data;

  // Mock response untuk development
  const { mockSchedules } = await import("./mock");
  
  // Simulasi network delay
  await new Promise((resolve) => setTimeout(resolve, 600));
  
  const scheduleGenerator = mockSchedules[poliId];
  if (scheduleGenerator) {
    return scheduleGenerator(date);
  }
  
  // Fallback default
  return generateDefaultSchedule(poliId, date);
}

// Fallback generator if poli not in mock
function generateDefaultSchedule(poliId: string, date: string): ScheduleResponse {
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