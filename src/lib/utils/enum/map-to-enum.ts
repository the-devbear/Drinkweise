import { isInEnum, isKeyInEnum } from './is-in-enum';
import { ValueNotInEnumError } from './value-not-in-enum.error';

export function tryMapToEnum<T extends object>(
  enumType: T,
  value: unknown
): T[keyof T] | undefined {
  return isInEnum(enumType, value) ? value : undefined;
}

/**
 * @throws {ValueNotInEnumError} if the value is not in the enum
 */
export function mapToEnum<T extends object>(enumType: T, value: unknown): T[keyof T] {
  if (!isInEnum(enumType, value)) {
    throw new ValueNotInEnumError(enumType, value);
  }
  return value;
}

export function tryMapKeyToEnum<T extends object>(enumType: T, key: unknown): keyof T | undefined {
  return isKeyInEnum(enumType, key) ? key : undefined;
}

/**
 * @throws {ValueNotInEnumError} if the key is not in the enum
 */
export function mapKeyToEnum<T extends object>(enumType: T, key: unknown): keyof T {
  if (!isKeyInEnum(enumType, key)) {
    throw new ValueNotInEnumError(enumType, key);
  }
  return key;
}
