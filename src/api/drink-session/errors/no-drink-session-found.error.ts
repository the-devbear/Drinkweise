export class NoDrinkSessionFoundError extends Error {
  private constructor(message: string) {
    super(message);
    this.name = 'NoDrinkSessionFoundError';
  }

  static fromId(id: string) {
    return new NoDrinkSessionFoundError(`No drink session found with id ${id}`);
  }
}
