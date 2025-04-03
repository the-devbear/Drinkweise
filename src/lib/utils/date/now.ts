/**
 * @returns {number} - The current time in milliseconds since the Unix epoch, with seconds and milliseconds set to zero.
 */
export function now(): number {
  return new Date().setSeconds(0, 0);
}
