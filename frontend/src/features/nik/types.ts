export interface CheckNikRequest {
  nik: string;
}

export interface PatientData {
  id: string;
  nik: string;
  name: string;
  birth_date: string;
  gender: "male" | "female";
  phone: string;
  address?: string;
  sebutan?: string;
  birth_place?: string;
  status?: string;
  province_id?: string;
  province_name?: string;
  district_id?: string;
  district_name?: string;
  subdistrict_id?: string;
  subdistrict_name?: string;
  village_id?: string;
  village_name?: string;
  occupation?: string;
  education?: string;
  religion?: string;
}

export interface CheckNikResponseData {
  found: boolean;
  patient: PatientData | null;
}

export interface CheckNikResponse {
  data: CheckNikResponseData;
}

export interface RegisterPatientRequest {
  nik: string;
  name: string;
  birth_date: string;
  gender: "male" | "female";
  address: string;
  phone: string;
  sebutan?: string;
  birth_place?: string;
  status?: string;
  province_id?: string;
  province_name?: string;
  district_id?: string;
  district_name?: string;
  subdistrict_id?: string;
  subdistrict_name?: string;
  village_id?: string;
  village_name?: string;
  occupation?: string;
  education?: string;
  religion?: string;
}

export interface RegisterPatientResponse {
  data: PatientData;
  message?: string;
}