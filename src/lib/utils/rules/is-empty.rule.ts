/**
 *
 * The value is considered empty if it is:
 * - `undefined`
 * - `null`
 * - an empty array
 * - an empty object
 *
 * @param value The value to check
 */
export const isEmptyRule: (value: unknown) => boolean = (value) =>
  value === undefined ||
  value === null ||
  (Array.isArray(value) && value.length === 0) ||
  (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0);
