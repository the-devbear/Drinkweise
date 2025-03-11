export class ValueNotInEnumError<Enum extends object, Value = unknown> extends Error {
  constructor(enumType: Enum, value: Value) {
    super(`Value ${value} is not in enum ${Object.values(enumType).join(', ')}`);
  }
}
