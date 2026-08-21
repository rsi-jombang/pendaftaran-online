import { useMutation } from "@tanstack/react-query";
import { checkNik, registerPatient } from "./api";
import type { CheckNikRequest, CheckNikResponse, RegisterPatientRequest, RegisterPatientResponse } from "./types";

export function useCheckNik() {
  return useMutation<CheckNikResponse, Error, CheckNikRequest>({
    mutationFn: checkNik,
  });
}

export function useRegisterPatient() {
  return useMutation<RegisterPatientResponse, Error, RegisterPatientRequest>({
    mutationFn: registerPatient,
  });
}