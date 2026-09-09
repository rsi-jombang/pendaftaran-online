import { useMutation } from "@tanstack/react-query";
import { submitRegistration } from "./api";
import type { RegistrationPayload, RegistrationResponseData } from "./types";
import type { ApiError } from "../../shared/types/api";

export function useSubmitRegistration() {
  return useMutation<RegistrationResponseData, ApiError, RegistrationPayload>({
    mutationFn: submitRegistration,
  });
}