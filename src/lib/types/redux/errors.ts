import type { AuthError } from '@supabase/supabase-js';

export type SerializedAuthError = {
  type: 'AuthError';
  message: string;
  code: AuthError['code'];
  status: number | undefined;
};

export type SerializedPostgrestError = {
  type: 'PostgrestError';
  message: string;
  code: string;
  details: string;
  hint: string;
};

export type SerializedCodedError<T = unknown> = {
  type: 'CodedError';
  message: string;
  code: string;
  info?: T;
};
