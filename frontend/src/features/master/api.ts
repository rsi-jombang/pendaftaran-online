import { api } from "../../shared/lib/axios";
import type { MasterRegionResponse } from "./types";

export async function getProvinsi(): Promise<MasterRegionResponse> {
  const response = await api.get<MasterRegionResponse>("/v1/master/provinsi");
  return response.data;
}

export async function getKabupaten(noProp?: string): Promise<MasterRegionResponse> {
  const response = await api.get<MasterRegionResponse>("/v1/master/kabupaten", {
    params: noProp ? { no_prop: noProp } : undefined,
  });
  return response.data;
}

export async function getKecamatan(
  noKab: string,
  noProp?: string
): Promise<MasterRegionResponse> {
  const response = await api.get<MasterRegionResponse>("/v1/master/kecamatan", {
    params: { no_kab: noKab, no_prop: noProp },
  });
  return response.data;
}

export async function getKelurahan(noKec: string): Promise<MasterRegionResponse> {
  const response = await api.get<MasterRegionResponse>("/v1/master/kelurahan", {
    params: { no_kec: noKec },
  });
  return response.data;
}
