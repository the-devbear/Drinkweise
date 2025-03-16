import type {
  SerializedAuthError,
  SerializedPostgrestError,
} from '@drinkweise/lib/types/redux/errors';
import type { AuthError, PostgrestError } from '@supabase/supabase-js';

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
