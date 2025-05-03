import { Button } from '@drinkweise/components/ui/Button';
import { Text } from '@drinkweise/components/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

interface AddDrinkErrorProps {
  message: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onRetry?: () => void;
  isRetrying?: boolean;
  canRetry?: boolean;
}

export function AddDrinkError({
  message,
  onRetry,
  canRetry,
  isRetrying,
  icon = 'sad-outline',
}: AddDrinkErrorProps) {
  return (
    <View className='flex-1 items-center justify-center py-10'>
      <Ionicons name={icon} className='text-5xl text-muted' />
      <Text variant='title3' className='mt-2 text-center font-semibold'>
        Something went wrong
      </Text>
      <Text variant='subhead' color='tertiary' className='mt-1 text-center'>
        {message}
      </Text>
      {canRetry ? (
        <Button loading={isRetrying} onPress={onRetry} className='mt-4' variant='primary'>
          <Text>Try again</Text>
        </Button>
      ) : (
        <Text variant='subhead' color='tertiary' className='mt-1 text-center'>
          Please try again later
        </Text>
      )}
    </View>
  );
}
