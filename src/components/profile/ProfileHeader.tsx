import { getUserInitials } from '@drinkweise/lib/utils/get-user-initials';
import { roundedNumberFormatter } from '@drinkweise/lib/utils/number/number-formatters';
import { Avatar, AvatarImage, AvatarFallback } from '@drinkweise/ui/Avatar';
import { Text } from '@drinkweise/ui/Text';
import { useMemo } from 'react';
import { View } from 'react-native';

interface ProfileHeaderProps {
  username: string;
  profilePicture?: string;
  sessionCount: number;
  weight: number;
  height: number;
}

export function ProfileHeader({
  username,
  profilePicture,
  sessionCount,
  weight,
  height,
}: ProfileHeaderProps) {
  const userInitials = useMemo(() => getUserInitials(username), [username]);
  const formattedWeight = roundedNumberFormatter.format(weight);

  return (
    <View className='flex-row items-center p-4'>
      <Avatar alt={username} className='mr-6 h-16 w-16'>
        <AvatarImage source={{ uri: profilePicture }} />
        <AvatarFallback className='bg-primary'>
          <Text variant='title1' className='font-semibold text-white'>
            {userInitials}
          </Text>
        </AvatarFallback>
      </Avatar>
      <View className='flex-1 justify-between'>
        <Text className='pb-1 text-xl font-bold'>{username}</Text>
        <View className='flex-row justify-between'>
          <View className='items-center'>
            <Text variant='heading' className='font-bold'>
              {sessionCount}
            </Text>
            <Text variant='caption1' className='text-muted-foreground'>
              Sessions
            </Text>
          </View>
          <View className='items-center'>
            <Text variant='heading' className='font-bold'>
              {formattedWeight}
            </Text>
            <Text variant='caption1' className='text-muted-foreground'>
              Weight (kg)
            </Text>
          </View>
          <View className='items-center'>
            <Text variant='heading' className='font-bold'>
              {height}
            </Text>
            <Text variant='caption1' className='text-muted-foreground'>
              Height (cm)
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
