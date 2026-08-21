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
}

export interface RegisterPatientResponse {
  data: PatientData;
  message?: string;
}