import { longDateFormatter } from '@drinkweise/lib/utils/date/date-formatters';
import { Avatar, AvatarFallback, AvatarImage } from '@drinkweise/ui/Avatar';
import { Text } from '@drinkweise/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';

interface SessionHeaderProps {
  name: string;
  note?: string;
  userName: string;
  startTime: Date;
  userProfilePictureUrl?: string;
  onUserProfilePress: () => void;
}

export const SessionHeader = memo(function SessionHeader({
  name,
  note,
  userName,
  startTime,
  userProfilePictureUrl,
  onUserProfilePress,
}: SessionHeaderProps) {
  return (
    <View className='gap-4 bg-card p-4'>
      <View className='flex-row items-center justify-between'>
        <View className='flex-1'>
          <Text className='mr-2 flex-1 text-2xl font-bold text-gray-900 dark:text-white'>
            {name}
          </Text>
          <View className='mt-1 flex-row items-center gap-2'>
            <Ionicons name='calendar-outline' size={20} color='gray' />
            <Text className='text-gray-700 dark:text-gray-300'>
              {longDateFormatter.format(startTime)}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={onUserProfilePress}>
          <Avatar alt='User Avatar'>
            <AvatarImage
              source={{
                uri: userProfilePictureUrl ?? undefined,
              }}
            />
            <AvatarFallback>
              <Text className='text-sm font-medium text-gray-800 dark:text-gray-300'>
                {userName.slice(0, 2).toUpperCase()}
              </Text>
            </AvatarFallback>
          </Avatar>
        </TouchableOpacity>
      </View>
      {note && (
        <View className='rounded-lg bg-gray-50 p-3 dark:bg-gray-800'>
          <View className='mb-1 flex-row items-center'>
            <Ionicons
              className='mr-1 text-[16px] text-gray-600 dark:text-gray-300'
              name='document-text-outline'
            />
            <Text className='text-base font-semibold text-gray-600 dark:text-gray-300'>Note</Text>
          </View>
          <Text className='text-sm text-gray-700 dark:text-gray-300'>{note}</Text>
        </View>
      )}
    </View>
  );
});
