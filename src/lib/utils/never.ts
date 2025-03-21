export function never(value: never): never {
  throw new Error(`This should never happen: ${value}`);
}
