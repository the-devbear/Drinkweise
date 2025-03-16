import type {
  SerializedAuthError,
  SerializedCodedError,
  SerializedPostgrestError,
} from '@drinkweise/lib/types/redux/errors';

function hasType<T extends string>(type: T, error: unknown): error is { type: T } {
  return !!error && typeof error === 'object' && 'type' in error && error.type === type;
}

export function isSerializedAuthError(error: unknown): error is SerializedAuthError {
  return hasType('AuthError', error);
}

export function isSerializedPostgrestError(error: unknown): error is SerializedPostgrestError {
  return hasType('PostgrestError', error);
}

export function isSerializedCodedError(error: unknown): error is SerializedCodedError {
  return hasType('CodedError', error);
}
