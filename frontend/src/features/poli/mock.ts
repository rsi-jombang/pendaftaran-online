import type { PoliListResponse, PoliDetailResponse, DoctorScheduleResponse } from "./types";

// TODO: replace mock — waiting for real endpoint from backend
export const mockPoliList: PoliListResponse = {
  success: true,
  message: "Data poli non BPJS yang tersedia hari ini.",
  data: [
    {
      id: "poli_anak",
      slug_poli: "poli_anak",
      name: "Poli Anak",
      nama_poli: "Poli Anak",
      category: "Spesialis",
      icon: "baby",
      jumlah_dokter: 1,
      jam_praktek: "14:30 - 16:00",
      description: "Melayani pemeriksaan dan konsultasi kesehatan anak usia 0-18 tahun.",
    },
    {
      id: "poli_bedah",
      slug_poli: "poli_bedah",
      name: "Poli Bedah Umum",
      nama_poli: "Poli Bedah Umum",
      category: "Spesialis",
      icon: "heart",
      jumlah_dokter: 1,
      jam_praktek: "13:00 - 14:00",
      description: "Melayani operasi dan tindakan bedah umum.",
    },
    {
      id: "poli_jantung",
      slug_poli: "poli_jantung",
      name: "Poli Jantung dan Pembuluh Darah",
      nama_poli: "Poli Jantung dan Pembuluh Darah",
      category: "Spesialis",
      icon: "heart",
      jumlah_dokter: 1,
      jam_praktek: "07:00 - 08:30",
      description: "Konsultasi dan penanganan penyakit jantung dan pembuluh darah.",
    },
    {
      id: "poli_mata",
      slug_poli: "poli_mata",
      name: "Poli Mata",
      nama_poli: "Poli Mata",
      category: "Spesialis",
      icon: "eye",
      jumlah_dokter: 2,
      jam_praktek: "14:00 - 16:00, 15:30 - 16:30",
      description: "Pemeriksaan dan perawatan kesehatan mata.",
    },
    {
      id: "poli_orthopedy",
      slug_poli: "poli_orthopedy",
      name: "Poli Orthopedi",
      nama_poli: "Poli Orthopedi",
      category: "Spesialis",
      icon: "activity",
      jumlah_dokter: 1,
      jam_praktek: "13:30 - 15:00",
      description: "Konsultasi dan penanganan penyakit tulang dan sendi.",
    },
    {
      id: "poli_paru",
      slug_poli: "poli_paru",
      name: "Poli Paru",
      nama_poli: "Poli Paru",
      category: "Spesialis",
      icon: "activity",
      jumlah_dokter: 1,
      jam_praktek: "16:00 - 18:00",
      description: "Konsultasi dan penanganan penyakit paru-paru.",
    },
    {
      id: "poli_interne",
      slug_poli: "poli_interne",
      name: "Poli Penyakit Dalam",
      nama_poli: "Poli Penyakit Dalam",
      category: "Spesialis",
      icon: "stethoscope",
      jumlah_dokter: 2,
      jam_praktek: "10:00 - 11:30, 15:00 - 17:00",
      description: "Pemeriksaan kesehatan umum dan konsultasi penyakit dalam.",
    },
    {
      id: "poli_syaraf",
      slug_poli: "poli_syaraf",
      name: "Poli Saraf",
      nama_poli: "Poli Saraf",
      category: "Spesialis",
      icon: "brain",
      jumlah_dokter: 1,
      jam_praktek: "15:00 - 17:00",
      description: "Konsultasi dan penanganan penyakit saraf.",
    },
  ],
};

export const mockPoliDetail: Record<string, PoliDetailResponse> = {
  "poli_anak": {
    success: true,
    message: "Detail poli anak",
    data: {
      id: "poli_anak",
      slug_poli: "poli_anak",
      name: "Poli Anak",
      nama_poli: "Poli Anak",
      category: "Spesialis",
      icon: "baby",
      jumlah_dokter: 1,
      jam_praktek: "14:30 - 16:00",
      description: "Melayani pemeriksaan dan konsultasi kesehatan anak usia 0-18 tahun.",
    },
  },
  "poli_bedah": {
    success: true,
    message: "Detail poli bedah",
    data: {
      id: "poli_bedah",
      slug_poli: "poli_bedah",
      name: "Poli Bedah Umum",
      nama_poli: "Poli Bedah Umum",
      category: "Spesialis",
      icon: "heart",
      jumlah_dokter: 1,
      jam_praktek: "13:00 - 14:00",
      description: "Melayani operasi dan tindakan bedah umum.",
    },
  },
  "poli_jantung": {
    success: true,
    message: "Detail poli jantung",
    data: {
      id: "poli_jantung",
      slug_poli: "poli_jantung",
      name: "Poli Jantung dan Pembuluh Darah",
      nama_poli: "Poli Jantung dan Pembuluh Darah",
      category: "Spesialis",
      icon: "heart",
      jumlah_dokter: 1,
      jam_praktek: "07:00 - 08:30",
      description: "Konsultasi dan penanganan penyakit jantung dan pembuluh darah.",
    },
  },
  "poli_mata": {
    success: true,
    message: "Detail poli mata",
    data: {
      id: "poli_mata",
      slug_poli: "poli_mata",
      name: "Poli Mata",
      nama_poli: "Poli Mata",
      category: "Spesialis",
      icon: "eye",
      jumlah_dokter: 2,
      jam_praktek: "14:00 - 16:00, 15:30 - 16:30",
      description: "Pemeriksaan dan perawatan kesehatan mata.",
    },
  },
  "poli_orthopedy": {
    success: true,
    message: "Detail poli orthopedi",
    data: {
      id: "poli_orthopedy",
      slug_poli: "poli_orthopedy",
      name: "Poli Orthopedi",
      nama_poli: "Poli Orthopedi",
      category: "Spesialis",
      icon: "activity",
      jumlah_dokter: 1,
      jam_praktek: "13:30 - 15:00",
      description: "Konsultasi dan penanganan penyakit tulang dan sendi.",
    },
  },
  "poli_paru": {
    success: true,
    message: "Detail poli paru",
    data: {
      id: "poli_paru",
      slug_poli: "poli_paru",
      name: "Poli Paru",
      nama_poli: "Poli Paru",
      category: "Spesialis",
      icon: "activity",
      jumlah_dokter: 1,
      jam_praktek: "16:00 - 18:00",
      description: "Konsultasi dan penanganan penyakit paru-paru.",
    },
  },
  "poli_interne": {
    success: true,
    message: "Detail poli penyakit dalam",
    data: {
      id: "poli_interne",
      slug_poli: "poli_interne",
      name: "Poli Penyakit Dalam",
      nama_poli: "Poli Penyakit Dalam",
      category: "Spesialis",
      icon: "stethoscope",
      jumlah_dokter: 2,
      jam_praktek: "10:00 - 11:30, 15:00 - 17:00",
      description: "Pemeriksaan kesehatan umum dan konsultasi penyakit dalam.",
    },
  },
  "poli_syaraf": {
    success: true,
    message: "Detail poli saraf",
    data: {
      id: "poli_syaraf",
      slug_poli: "poli_syaraf",
      name: "Poli Saraf",
      nama_poli: "Poli Saraf",
      category: "Spesialis",
      icon: "brain",
      jumlah_dokter: 1,
      jam_praktek: "15:00 - 17:00",
      description: "Konsultasi dan penanganan penyakit saraf.",
    },
  },
};

const generateDoctorSchedule = (poliId: string, date: string) => {
  const doctor = {
    id: "DOK-01",
    name: "dr. Dokter Utama",
    avatar_url: "/doctor-male.png",
    practice_hours: "08:00-12:00",
    quota_remaining: 10,
    quota_status: "available" as const,
    status: "BUKA" as const,
    source: "bpjs" as const,
  };

  return {
    data: {
      poli: { id: poliId, name: mockPoliDetail[poliId]?.data?.nama_poli || "Poli" },
      date,
      doctors: [doctor],
    },
  };
};

export const mockDoctorSchedule: Record<string, DoctorScheduleResponse> = {};

const polis = [
  "poli_anak",
  "poli_bedah",
  "poli_jantung",
  "poli_mata",
  "poli_orthopedy",
  "poli_paru",
  "poli_interne",
  "poli_syaraf",
];

const today = new Date();
for (let i = 0; i < 7; i++) {
  const date = new Date(today);
  date.setDate(today.getDate() + i);
  const dateStr = date.toISOString().split("T")[0];

  for (const poliId of polis) {
    mockDoctorSchedule[`${poliId}-${dateStr}`] = generateDoctorSchedule(poliId, dateStr);
  }
}
