export interface Success<T> {
  value: T;
  error?: undefined;
}

export interface Failure<E extends Error = Error> {
  value?: undefined;
  error: E;
}

export type Result<T, E extends Error = Error> = Promise<Success<T> | Failure<E>>;
