export interface Success<T> {
  value: T;
  error?: undefined;
}

export interface Failure<E extends { message: string } = { message: string }> {
  value?: undefined;
  error: E;
}

export type Result<T, E extends { message: string } = { message: string }> = Promise<
  Success<T> | Failure<E>
>;
