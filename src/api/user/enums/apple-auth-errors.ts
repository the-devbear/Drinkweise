export const AppleAuthErrorsKeys = {
  ERR_INVALID_OPERATION: 'ERR_INVALID_OPERATION',
  ERR_INVALID_RESPONSE: 'ERR_INVALID_RESPONSE',
  ERR_INVALID_SCOPE: 'ERR_INVALID_SCOPE',
  ERR_REQUEST_CANCELED: 'ERR_REQUEST_CANCELED',
  ERR_REQUEST_FAILED: 'ERR_REQUEST_FAILED',
  ERR_REQUEST_NOT_HANDLED: 'ERR_REQUEST_NOT_HANDLED',
  ERR_REQUEST_NOT_INTERACTIVE: 'ERR_REQUEST_NOT_INTERACTIVE',
  ERR_REQUEST_UNKNOWN: 'ERR_REQUEST_UNKNOWN',
} as const;

export const AppleAuthErrors = {
  [AppleAuthErrorsKeys.ERR_INVALID_OPERATION]:
    'An invalid authorization operation has been performed.',
  [AppleAuthErrorsKeys.ERR_INVALID_RESPONSE]:
    'The authorization request received an invalid response.',
  [AppleAuthErrorsKeys.ERR_INVALID_SCOPE]: 'An invalid AppleAuthenticationScope was passed in.',
  [AppleAuthErrorsKeys.ERR_REQUEST_CANCELED]: 'The user canceled the authorization attempt.',
  [AppleAuthErrorsKeys.ERR_REQUEST_FAILED]:
    'The authorization attempt failed. See the error message for additional information.',
  [AppleAuthErrorsKeys.ERR_REQUEST_NOT_HANDLED]:
    "The authorization request wasn't correctly handled.",
  [AppleAuthErrorsKeys.ERR_REQUEST_NOT_INTERACTIVE]: "The authorization request isn't interactive.",
  [AppleAuthErrorsKeys.ERR_REQUEST_UNKNOWN]:
    'The authorization attempt failed for an unknown reason.',
} as const;

export type AppleAuthErrorsKeys = (typeof AppleAuthErrorsKeys)[keyof typeof AppleAuthErrorsKeys];
export type AppleAuthError = (typeof AppleAuthErrors)[keyof typeof AppleAuthErrors];
