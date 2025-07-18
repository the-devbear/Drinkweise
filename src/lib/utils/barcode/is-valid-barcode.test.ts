import { isValidBarcode } from './is-valid-barcode';

describe('isValidBarcode', () => {
  describe('Valid barcodes', () => {
    it('should return true for valid EAN-13 barcode', () => {
      expect(isValidBarcode('1234567890123')).toBe(true);
    });

    it('should return true for valid EAN-8 barcode', () => {
      expect(isValidBarcode('12345678')).toBe(true);
    });

    it('should return true for valid UPC-A barcode', () => {
      expect(isValidBarcode('123456789012')).toBe(true);
    });

    it('should handle barcode with leading/trailing whitespace', () => {
      expect(isValidBarcode('  1234567890123  ')).toBe(true);
    });
  });

  describe('Invalid barcodes', () => {
    it('should return false for non-numeric characters', () => {
      expect(isValidBarcode('123abc7890123')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isValidBarcode('')).toBe(false);
    });

    it('should return false for null/undefined', () => {
      expect(isValidBarcode(null as unknown as string)).toBe(false);
      expect(isValidBarcode(undefined as unknown as string)).toBe(false);
    });

    it('should return false for invalid lengths', () => {
      expect(isValidBarcode('123')).toBe(false);
      expect(isValidBarcode('123456789')).toBe(false);
      expect(isValidBarcode('12345678901234')).toBe(false);
    });

    it('should return false for barcode with special characters', () => {
      expect(isValidBarcode('1234567890-123')).toBe(false);
      expect(isValidBarcode('1234567890.123')).toBe(false);
    });
  });
});
