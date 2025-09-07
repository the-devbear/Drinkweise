export class FeatureRequestNotFoundError extends Error {
  public readonly name = 'FeatureRequestNotFoundError';

  constructor(message: string = 'Feature request not found') {
    super(message);
  }

  static fromId(id: string): FeatureRequestNotFoundError {
    return new FeatureRequestNotFoundError(`Feature request with ID ${id} not found`);
  }
}