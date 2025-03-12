export function isInEnum<T extends object>(enumType: T, value: unknown): value is T[keyof T] {
  return Object.values(enumType).includes(value as T[keyof T]);
}

export function isKeyInEnum<T extends object>(enumType: T, key: unknown): key is keyof T {
  return Object.keys(enumType).includes(key as string);
}
