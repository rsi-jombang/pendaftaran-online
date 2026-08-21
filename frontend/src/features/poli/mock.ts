import type { PoliListResponse } from "./types";

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
    },
    {
      id: "POLI-02",
      name: "Poli Gigi",
      category: "Gigi",
      icon: "tooth",
      doctors_today: 1,
      quota_remaining: 0,
      quota_status: "full",
    },
    {
      id: "POLI-03",
      name: "Poli Umum",
      category: "Umum",
      icon: "stethoscope",
      doctors_today: 5,
      quota_remaining: 25,
      quota_status: "available",
    },
    {
      id: "POLI-04",
      name: "Poli Jantung",
      category: "Spesialis",
      icon: "heart",
      doctors_today: 2,
      quota_remaining: 8,
      quota_status: "available",
    },
    {
      id: "POLI-05",
      name: "Poli Mata",
      category: "Spesialis",
      icon: "eye",
      doctors_today: 2,
      quota_remaining: 15,
      quota_status: "available",
    },
    {
      id: "POLI-06",
      name: "Poli Kulit",
      category: "Spesialis",
      icon: "droplet",
      doctors_today: 1,
      quota_remaining: 6,
      quota_status: "available",
    },
  ],
};
