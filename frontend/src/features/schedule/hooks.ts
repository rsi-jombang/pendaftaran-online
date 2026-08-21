import { useQuery } from "@tanstack/react-query";
import { getDoctorSchedule } from "./api";

export function useDoctorSchedule(poliId: string | null, date: string | null) {
  return useQuery({
    queryKey: ["schedule", "doctors", poliId, date],
    queryFn: () => getDoctorSchedule(poliId!, date!),
    enabled: !!poliId && !!date,
    staleTime: 2 * 60 * 1000, // 2 menit - jadwal bisa berubah lebih sering
  });
}