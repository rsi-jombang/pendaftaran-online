import { useQuery } from "@tanstack/react-query";
import { getQueueStatus } from "./api";

export function useQueueStatus(registrationId: string | null) {
  return useQuery({
    queryKey: ["queue", "status", registrationId],
    queryFn: () => getQueueStatus(registrationId!),
    enabled: !!registrationId,
    // Polling 15 detik, auto-stop saat status "done" atau error berulang
    refetchInterval: (query) => {
      if (query.state.error) return 30000; // Retry lebih lambat saat error
      const status = query.state.data?.data?.status;
      if (status === "done") return false; // Stop polling saat selesai
      return 15000;
    },
    staleTime: 10000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 15000),
  });
}