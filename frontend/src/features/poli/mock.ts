import type { PoliListResponse, PoliDetailResponse } from "./types";

// TODO: replace mock — waiting for real endpoint from backend
export const mockPoliList: PoliListResponse = {
  data: [
    {
      id: "POLI-01",
      name: "Poli Anak",
      category: "Spesialis",
      icon: "baby",
      doctors_today: 3,
      quota_remaining: 12,
      quota_status: "available",
      description: "Melayani pemeriksaan dan konsultasi kesehatan anak usia 0-18 tahun.",
    },
    {
      id: "POLI-02",
      name: "Poli Gigi",
      category: "Gigi",
      icon: "tooth",
      doctors_today: 1,
      quota_remaining: 0,
      quota_status: "full",
      description: "Melayani pemeriksaan dan perawatan kesehatan gigi dan mulut.",
    },
    {
      id: "POLI-03",
      name: "Poli Umum",
      category: "Umum",
      icon: "stethoscope",
      doctors_today: 5,
      quota_remaining: 25,
      quota_status: "available",
      description: "Pemeriksaan kesehatan umum dan konsultasi penyakit dalam.",
    },
    {
      id: "POLI-04",
      name: "Poli Jantung",
      category: "Spesialis",
      icon: "heart",
      doctors_today: 2,
      quota_remaining: 8,
      quota_status: "available",
      description: "Konsultasi dan penanganan penyakit jantung dan pembuluh darah.",
    },
    {
      id: "POLI-05",
      name: "Poli Mata",
      category: "Spesialis",
      icon: "eye",
      doctors_today: 2,
      quota_remaining: 15,
      quota_status: "available",
      description: "Pemeriksaan dan perawatan kesehatan mata.",
    },
    {
      id: "POLI-06",
      name: "Poli Kulit",
      category: "Spesialis",
      icon: "droplet",
      doctors_today: 1,
      quota_remaining: 6,
      quota_status: "available",
      description: "Konsultasi dan penanganan penyakit kulit dan kelamin.",
    },
  ],
};

export const mockPoliDetail: Record<string, PoliDetailResponse> = {
  "POLI-01": {
    data: {
      id: "POLI-01",
      name: "Poli Anak",
      category: "Spesialis",
      icon: "baby",
      doctors_today: 3,
      quota_remaining: 12,
      quota_status: "available",
      description: "Melayani pemeriksaan dan konsultasi kesehatan anak usia 0-18 tahun.",
    },
  },
  "POLI-02": {
    data: {
      id: "POLI-02",
      name: "Poli Gigi",
      category: "Gigi",
      icon: "tooth",
      doctors_today: 1,
      quota_remaining: 0,
      quota_status: "full",
      description: "Melayani pemeriksaan dan perawatan kesehatan gigi dan mulut.",
    },
  },
  "POLI-03": {
    data: {
      id: "POLI-03",
      name: "Poli Umum",
      category: "Umum",
      icon: "stethoscope",
      doctors_today: 5,
      quota_remaining: 25,
      quota_status: "available",
      description: "Pemeriksaan kesehatan umum dan konsultasi penyakit dalam.",
    },
  },
  "POLI-04": {
    data: {
      id: "POLI-04",
      name: "Poli Jantung",
      category: "Spesialis",
      icon: "heart",
      doctors_today: 2,
      quota_remaining: 8,
      quota_status: "available",
      description: "Konsultasi dan penanganan penyakit jantung dan pembuluh darah.",
    },
  },
  "POLI-05": {
    data: {
      id: "POLI-05",
      name: "Poli Mata",
      category: "Spesialis",
      icon: "eye",
      doctors_today: 2,
      quota_remaining: 15,
      quota_status: "available",
      description: "Pemeriksaan dan perawatan kesehatan mata.",
    },
  },
  "POLI-06": {
    data: {
      id: "POLI-06",
      name: "Poli Kulit",
      category: "Spesialis",
      icon: "droplet",
      doctors_today: 1,
      quota_remaining: 6,
      quota_status: "available",
      description: "Konsultasi dan penanganan penyakit kulit dan kelamin.",
    },
  },
};

const generateDoctorSchedule = (poliId: string, date: string) => {
  const dayOfMonth = new Date(date).getDate();
  
  if (poliId === "POLI-01") {
    return {
      data: {
        poli: { id: "POLI-01", name: "Poli Anak" },
        date,
        doctors: [
          {
            id: "DOK-01",
            name: "dr. Sarah Wijaya, Sp.A",
            avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
            practice_hours: "09:00-12:00",
            quota_remaining: dayOfMonth % 2 === 0 ? 0 : 5,
            quota_status: dayOfMonth % 2 === 0 ? "full" : "available",
          },
          {
            id: "DOK-02",
            name: "dr. Andi Prasetyo, Sp.A",
            avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=andi",
            practice_hours: "13:00-16:00",
            quota_remaining: dayOfMonth % 3 === 0 ? 0 : 8,
            quota_status: dayOfMonth % 3 === 0 ? "full" : "available",
          },
        ],
      },
    };
  }
  
  if (poliId === "POLI-02") {
    return {
      data: {
        poli: { id: "POLI-02", name: "Poli Gigi" },
        date,
        doctors: [
          {
            id: "DOK-03",
            name: "dr. Maya Sari, Sp.KG",
            avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=maya",
            practice_hours: "08:00-11:00",
            quota_remaining: 6,
            quota_status: "available",
          },
        ],
      },
    };
  }
  
  // Default for other polis
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
};

export const mockDoctorSchedule: Record<string, any> = {};

// Generate schedules for the next 7 days for each poli
const polis = ["POLI-01", "POLI-02", "POLI-03", "POLI-04", "POLI-05", "POLI-06"];
const today = new Date();
for (let i = 0; i < 7; i++) {
  const date = new Date(today);
  date.setDate(today.getDate() + i);
  const dateStr = date.toISOString().split("T")[0];
  
  for (const poliId of polis) {
    mockDoctorSchedule[`${poliId}-${dateStr}`] = generateDoctorSchedule(poliId, dateStr);
  }
}