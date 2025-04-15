"use client";

import {
  UseFormProps,
  UseFormReturn,
  useForm as useReactHookForm,
} from "react-hook-form";

export function useForm<T extends Record<string, unknown>>(
  options: UseFormProps<T>,
): UseFormReturn<T> {
  return useReactHookForm<T>(options);
}
