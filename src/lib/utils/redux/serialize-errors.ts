import type {
  SerializedAuthError,
  SerializedCodedError,
  SerializedPostgrestError,
} from '@drinkweise/lib/types/redux/errors';
import type { AuthError, PostgrestError } from '@supabase/supabase-js';
import type { CodedError } from 'expo-modules-core';

export function serializeAuthError(error: AuthError): SerializedAuthError {
  return {
    type: 'AuthError',
    message: error.message,
    code: error.code,
    status: error.status,
  };
}

export function serializePostgrestError(error: PostgrestError): SerializedPostgrestError {
  return {
    type: 'PostgrestError',
    message: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint,
  };
}

export function serializeCodedError<T = unknown>(error: CodedError): SerializedCodedError<T> {
  return {
    type: 'CodedError',
    message: error.message,
    code: error.code,
    info: error.info,
  };
}
