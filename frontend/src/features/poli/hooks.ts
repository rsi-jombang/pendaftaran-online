import { useQuery } from "@tanstack/react-query";
import { getPoliList, getPoliDetail, getDoctorSchedule } from "./api";

export function usePoliListToday() {
  return useQuery({
    queryKey: ["poli", "list", "today"],
    queryFn: () => getPoliList(true),
    staleTime: 5 * 60 * 1000,
  });
}

export function usePoliList() {
  return useQuery({
    queryKey: ["poli", "list"],
    queryFn: () => getPoliList(),
    staleTime: 5 * 60 * 1000,
  });
}

export function usePoliDetail(slugPoli: string | null) {
  return useQuery({
    queryKey: ["poli", "detail", slugPoli],
    queryFn: () => getPoliDetail(slugPoli!),
    enabled: !!slugPoli,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDoctorSchedule(slugPoli: string | null, date: string | null) {
  return useQuery({
    queryKey: ["schedule", "doctors", slugPoli, date],
    queryFn: () => getDoctorSchedule(slugPoli!, date!),
    enabled: !!slugPoli && !!date,
    staleTime: 2 * 60 * 1000, // 2 menit - jadwal bisa berubah lebih sering
  });
}