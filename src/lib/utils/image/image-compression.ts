import * as ImageManipulator from 'expo-image-manipulator';

export interface ImageCompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: ImageManipulator.SaveFormat;
}

const DEFAULT_OPTIONS: Required<ImageCompressionOptions> = {
  maxWidth: 800,
  maxHeight: 800,
  quality: 0.8,
  format: ImageManipulator.SaveFormat.JPEG,
};

export async function compressImage(
  uri: string,
  options: ImageCompressionOptions = {}
): Promise<string> {
  const finalOptions = { ...DEFAULT_OPTIONS, ...options };

  try {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [
        {
          resize: {
            width: finalOptions.maxWidth,
            height: finalOptions.maxHeight,
          },
        },
      ],
      {
        compress: finalOptions.quality,
        format: finalOptions.format,
      }
    );

    return result.uri;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw new Error('Failed to compress image');
  }
}
