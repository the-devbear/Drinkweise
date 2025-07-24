export class UserProfileNotUpdated extends Error {
  private constructor(message: string) {
    super(message);
    this.name = 'UserProfileNotUpdated';
  }

  public static fromEmpty() {
    return new UserProfileNotUpdated(
      'User profile update failed: No data returned from the update operation.'
    );
  }
}
