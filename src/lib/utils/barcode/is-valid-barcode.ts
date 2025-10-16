export function isValidBarcode(barcode: string): boolean {
  const cleanBarcode = barcode.trim();

  if (!/^d+$/.test(cleanBarcode)) {
    return false;
  }

  const length = cleanBarcode.length;

  // EAN-13: 13 digits, EAN-8: 8 digits, UPC-A: 12 digits
  return length === 8 || length === 12 || length === 13;
}
