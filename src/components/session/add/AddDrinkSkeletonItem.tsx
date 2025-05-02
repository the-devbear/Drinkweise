import { View } from 'react-native';

export function AddDrinkSkeletonItem() {
  return (
    <View className='animate-pulse border-b border-border bg-card p-2'>
      <View className='flex-row items-center justify-between'>
        <View className='flex-row items-center'>
          <View className='mr-3 h-16 w-16 rounded-full bg-muted' />
          <View className='flex-col'>
            <View className='mb-2 h-5 w-32 rounded-md bg-muted' />
            <View className='h-4 w-20 rounded-md bg-muted' />
          </View>
        </View>
        <View className='flex-col items-end'>
          <View className='mb-2 h-4 w-24 rounded-md bg-muted' />
          <View className='h-4 w-12 rounded-md bg-muted' />
        </View>
      </View>
    </View>
  );
}
