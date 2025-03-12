import type { CodedError } from 'expo-modules-core';

export function isCodedError(error: unknown): error is CodedError {
  return (
    typeof error === 'object' && error !== null && 'code' in error && typeof error.code === 'string'
  );
}
