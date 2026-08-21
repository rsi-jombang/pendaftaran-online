import { useMutation } from "@tanstack/react-query";
import { submitRegistration } from "./api";
import type { RegistrationPayload, RegistrationResponseData } from "./types";

export function useSubmitRegistration() {
  return useMutation<RegistrationResponseData, Error, RegistrationPayload>({
    mutationFn: submitRegistration,
  });
}