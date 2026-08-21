import { useQuery } from "@tanstack/react-query";
import { getPoliList } from "./api";

export function usePoliList() {
  return useQuery({
    queryKey: ["poli", "list"],
    queryFn: getPoliList,
    staleTime: 5 * 60 * 1000, // 5 menit - data poli jarang berubah
  });
}
