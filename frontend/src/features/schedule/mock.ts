// import type { ScheduleResponse } from "./types";

// TODO: replace mock — waiting for real endpoint from backend

// Generate mock doctors for a given poli and date
export const generateMockSchedule = (poliId: string, poliName: string, date: string) => {
  const doctors = [
    {
      jadwal_id: 1,
      id: "DOK-01",
      name: "dr. Sarah Wijaya, Sp.A",
      avatar_url: "/doctor-female.png",
      practice_hours: "09:00-12:00",
      quota_remaining: 5,
      quota_status: "available" as const,
      status: "BUKA" as const,
    },
    {
      jadwal_id: 2,
      id: "DOK-02",
      name: "dr. Andi Prasetyo, Sp.A",
      avatar_url: "/doctor-male.png",
      practice_hours: "13:00-16:00",
      quota_remaining: 0,
      quota_status: "full" as const,
      status: "TUTUP" as const,
    },
    {
      jadwal_id: 3,
      id: "DOK-03",
      name: "dr. Maya Sari, Sp.PD",
      avatar_url: "/doctor-female.png",
      practice_hours: "08:00-11:00",
      quota_remaining: 8,
      quota_status: "available" as const,
      status: "BELUM BUKA" as const,
    },
    {
      jadwal_id: 4,
      id: "DOK-04",
      name: "dr. Budi Santoso, Sp.M",
      avatar_url: "/doctor-male.png",
      practice_hours: "14:00-17:00",
      quota_remaining: 3,
      quota_status: "available" as const,
      status: "BELUM BUKA" as const,
    },
  ];

  // Return 2-4 doctors per day, with some having full quota
  const dayOfMonth = new Date(date).getDate();
  const doctorCount = 2 + (dayOfMonth % 3); // 2-4 doctors
  const selectedDoctors = doctors.slice(0, doctorCount);

  // Make first doctor full quota on even dates for variety
  if (dayOfMonth % 2 === 0 && selectedDoctors.length > 0) {
    selectedDoctors[0] = { ...selectedDoctors[0], quota_remaining: 0, quota_status: "full", status: "TUTUP" };
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
export const mockSchedules: Record<string, (date: string) => any> = {
  "poli_anak": (date: string) => generateMockSchedule("poli_anak", "Poli Anak", date),
  "poli_bedah": (date: string) => generateMockSchedule("poli_bedah", "Poli Bedah Umum", date),
  "poli_jantung": (date: string) => generateMockSchedule("poli_jantung", "Poli Jantung", date),
  "poli_mata": (date: string) => generateMockSchedule("poli_mata", "Poli Mata", date),
  "poli_orthopedy": (date: string) => generateMockSchedule("poli_orthopedy", "Poli Orthopedi", date),
  "poli_paru": (date: string) => generateMockSchedule("poli_paru", "Poli Paru", date),
  "poli_interne": (date: string) => generateMockSchedule("poli_interne", "Poli Penyakit Dalam", date),
  "poli_syaraf": (date: string) => generateMockSchedule("poli_syaraf", "Poli Saraf", date),
};