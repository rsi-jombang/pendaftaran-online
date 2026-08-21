import { useQuery } from "@tanstack/react-query";
import { getPoliList, getPoliDetail, getDoctorSchedule } from "./api";

export function usePoliList() {
  return useQuery({
    queryKey: ["poli", "list"],
    queryFn: getPoliList,
    staleTime: 5 * 60 * 1000, // 5 menit - data poli jarang berubah
  });
}

export function usePoliDetail(poliId: string | null) {
  return useQuery({
    queryKey: ["poli", "detail", poliId],
    queryFn: () => getPoliDetail(poliId!),
    enabled: !!poliId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDoctorSchedule(poliId: string | null, date: string | null) {
  return useQuery({
    queryKey: ["schedule", "doctors", poliId, date],
    queryFn: () => getDoctorSchedule(poliId!, date!),
    enabled: !!poliId && !!date,
    staleTime: 2 * 60 * 1000, // 2 menit - jadwal bisa berubah lebih sering
  });
}