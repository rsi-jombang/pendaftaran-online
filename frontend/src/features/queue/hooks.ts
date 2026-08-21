import { useQuery } from "@tanstack/react-query";
import { getQueueStatus } from "./api";

export function useQueueStatus(registrationId: string | null) {
  return useQuery({
    queryKey: ["queue", "status", registrationId],
    queryFn: () => getQueueStatus(registrationId!),
    enabled: !!registrationId,
    refetchInterval: 15000, // Polling setiap 15 detik (sesuai AGENTS.md Section 0 - polling sederhana)
    staleTime: 10000, // 10 detik stale time untuk data antrian yang berubah cepat
  });
}