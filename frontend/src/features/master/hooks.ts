import { useQuery } from "@tanstack/react-query";
import { getProvinsi, getKabupaten, getKecamatan, getKelurahan, getAsuransi, getPerusahaan } from "./api";

export function useProvinsi() {
  return useQuery({
    queryKey: ["master", "provinsi"],
    queryFn: getProvinsi,
    staleTime: 30 * 60 * 1000,
  });
}

export function useKabupaten(noProp: string | null | undefined) {
  return useQuery({
    queryKey: ["master", "kabupaten", noProp ?? ""],
    queryFn: () => getKabupaten(noProp as string),
    enabled: !!noProp,
    staleTime: 30 * 60 * 1000,
  });
}

export function useAllKabupaten() {
  return useQuery({
    queryKey: ["master", "kabupaten", "all"],
    queryFn: () => getKabupaten(""),
    staleTime: 30 * 60 * 1000,
  });
}

export function useKecamatan(
  noKab: string | null | undefined,
  noProp?: string | null | undefined
) {
  return useQuery({
    queryKey: ["master", "kecamatan", noKab ?? "", noProp ?? ""],
    queryFn: () => getKecamatan(noKab as string, noProp ?? undefined),
    enabled: !!noKab,
    staleTime: 30 * 60 * 1000,
  });
}

export function useKelurahan(noKec: string | null | undefined) {
  return useQuery({
    queryKey: ["master", "kelurahan", noKec ?? ""],
    queryFn: () => getKelurahan(noKec as string),
    enabled: !!noKec,
    staleTime: 30 * 60 * 1000,
  });
}

export function useAsuransi() {
  return useQuery({
    queryKey: ["master", "asuransi"],
    queryFn: getAsuransi,
    staleTime: 30 * 60 * 1000,
  });
}

export function usePerusahaan() {
  return useQuery({
    queryKey: ["master", "perusahaan"],
    queryFn: getPerusahaan,
    staleTime: 30 * 60 * 1000,
  });
}
