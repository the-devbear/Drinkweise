/**
 * Checks if a string is a valid barcode format (EAN-13, EAN-8, UPC-A, UPC-E)
 * @param barcode The barcode string to validate
 * @returns True if the barcode is in a valid format
 */
export function isValidBarcode(barcode: string): boolean {
  if (!barcode || typeof barcode !== 'string') {
    return false;
  }

  // Remove any whitespace
  const cleanBarcode = barcode.trim();

  // Check if it's only digits
  if (!/^\d+$/.test(cleanBarcode)) {
    return false;
  }

  // Check valid barcode lengths
  const length = cleanBarcode.length;

  // EAN-13: 13 digits
  // EAN-8: 8 digits
  // UPC-A: 12 digits
  // UPC-E: 8 digits (but we'll treat as EAN-8)
  return length === 8 || length === 12 || length === 13;
}
