export class ProfilePictureUploadError extends Error {
  constructor(
    message: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'ProfilePictureUploadError';
  }

  static fromCompressionFailure(cause?: Error): ProfilePictureUploadError {
    return new ProfilePictureUploadError(
      'Failed to compress image. Please try with a different image.',
      cause
    );
  }

  static fromStorageFailure(cause?: Error): ProfilePictureUploadError {
    return new ProfilePictureUploadError(
      'Failed to upload image to storage. Please check your internet connection and try again.',
      cause
    );
  }

  static fromDatabaseFailure(cause?: Error): ProfilePictureUploadError {
    return new ProfilePictureUploadError('Failed to update profile. Please try again.', cause);
  }

  static fromPermissionDenied(): ProfilePictureUploadError {
    return new ProfilePictureUploadError(
      'Permission denied. Please allow camera and photo library access in settings.'
    );
  }

  static fromFileTooLarge(): ProfilePictureUploadError {
    return new ProfilePictureUploadError(
      'Image file is too large. Please select an image smaller than 5MB.'
    );
  }

  static fromInvalidFormat(): ProfilePictureUploadError {
    return new ProfilePictureUploadError(
      'Invalid image format. Please select a JPEG, PNG, or WebP image.'
    );
  }
}
