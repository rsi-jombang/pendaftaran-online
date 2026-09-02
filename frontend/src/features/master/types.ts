export interface MasterRegionItem {
  id: string;
  nama: string;
}

export interface MasterProvinsi extends MasterRegionItem {}
export interface MasterKabupaten extends MasterRegionItem {}
export interface MasterKecamatan extends MasterRegionItem {}
export interface MasterKelurahan extends MasterRegionItem {}

export interface MasterRegionResponse {
  data: MasterRegionItem[];
  message?: string;
}

export interface MasterAsuransiItem {
  id: string;
  nama: string;
}

export interface MasterPerusahaanItem {
  id: string;
  nama: string;
}

export interface MasterAsuransiResponse {
  data: MasterAsuransiItem[];
  message?: string;
}

export interface MasterPerusahaanResponse {
  data: MasterPerusahaanItem[];
  message?: string;
}
