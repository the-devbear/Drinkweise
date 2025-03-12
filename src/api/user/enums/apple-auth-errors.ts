export const AppleAuthErrors = {
  ERR_INVALID_OPERATION: 'An invalid authorization operation has been performed.',
  ERR_INVALID_RESPONSE: 'The authorization request received an invalid response.',
  ERR_INVALID_SCOPE: 'An invalid AppleAuthenticationScope was passed in.',
  ERR_REQUEST_CANCELED: 'The user canceled the authorization attempt.',
  ERR_REQUEST_FAILED:
    'The authorization attempt failed. See the error message for additional information.',
  ERR_REQUEST_NOT_HANDLED: "The authorization request wasn't correctly handled.",
  ERR_REQUEST_NOT_INTERACTIVE: "The authorization request isn't interactive.",
  ERR_REQUEST_UNKNOWN: 'The authorization attempt failed for an unknown reason.',
} as const;

export type AppleAuthError = (typeof AppleAuthErrors)[keyof typeof AppleAuthErrors];
export type AppleAuthErrorKey = keyof typeof AppleAuthErrors;
