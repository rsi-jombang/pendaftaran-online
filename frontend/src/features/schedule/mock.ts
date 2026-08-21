import type { ScheduleResponse } from "./types";

// TODO: replace mock — waiting for real endpoint from backend

// Generate mock doctors for a given poli and date
export const generateMockSchedule = (poliId: string, poliName: string, date: string): ScheduleResponse => {
  const doctors = [
    {
      id: "DOK-01",
      name: "dr. Sarah Wijaya, Sp.A",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      practice_hours: "09:00-12:00",
      quota_remaining: 5,
      quota_status: "available" as const,
    },
    {
      id: "DOK-02",
      name: "dr. Andi Prasetyo, Sp.A",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=andi",
      practice_hours: "13:00-16:00",
      quota_remaining: 0,
      quota_status: "full" as const,
    },
    {
      id: "DOK-03",
      name: "dr. Maya Sari, Sp.PD",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=maya",
      practice_hours: "08:00-11:00",
      quota_remaining: 8,
      quota_status: "available" as const,
    },
    {
      id: "DOK-04",
      name: "dr. Budi Santoso, Sp.M",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=budi",
      practice_hours: "14:00-17:00",
      quota_remaining: 3,
      quota_status: "available" as const,
    },
  ];

  // Return 2-4 doctors per day, with some having full quota
  const dayOfMonth = new Date(date).getDate();
  const doctorCount = 2 + (dayOfMonth % 3); // 2-4 doctors
  const selectedDoctors = doctors.slice(0, doctorCount);

  // Make first doctor full quota on even dates for variety
  if (dayOfMonth % 2 === 0 && selectedDoctors.length > 0) {
    selectedDoctors[0] = { ...selectedDoctors[0], quota_remaining: 0, quota_status: "full" };
  }

  return {
    data: {
      poli: { id: poliId, name: poliName },
      date,
      doctors: selectedDoctors,
    },
  };
};

// Mock schedules for different polis
export const mockSchedules: Record<string, (date: string) => ScheduleResponse> = {
  "POLI-01": (date: string) => generateMockSchedule("POLI-01", "Poli Anak", date),
  "POLI-02": (date: string) => generateMockSchedule("POLI-02", "Poli Gigi", date),
  "POLI-03": (date: string) => generateMockSchedule("POLI-03", "Poli Umum", date),
  "POLI-04": (date: string) => generateMockSchedule("POLI-04", "Poli Jantung", date),
  "POLI-05": (date: string) => generateMockSchedule("POLI-05", "Poli Mata", date),
  "POLI-06": (date: string) => generateMockSchedule("POLI-06", "Poli Kulit", date),
};