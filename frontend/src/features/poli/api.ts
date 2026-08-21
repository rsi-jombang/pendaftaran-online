// import { api } from "../../shared/lib/axios";
import type { PoliListResponse } from "./types";

// TODO: replace mock — waiting for real endpoint from backend
// Sementara ini akan dipanggil tapi return mock data
export async function getPoliList(): Promise<PoliListResponse> {
  // Uncomment when backend ready:
  // const response = await api.get<PoliListResponse>("/poli");
  // return response.data;
  
  // Mock response untuk development
  const { mockPoliList } = await import("./mock");
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockPoliList), 800); // Simulasi network delay
  });
}
