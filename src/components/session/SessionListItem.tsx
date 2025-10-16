import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@drinkweise/components/ui/Card';
import { Text } from '@drinkweise/components/ui/Text';
import { cn } from '@drinkweise/lib/cn';
import { longDateFormatter } from '@drinkweise/lib/utils/date/date-formatters';
import { shortTimeFormatter } from '@drinkweise/lib/utils/date/time-formatter';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { memo, useCallback, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';

interface SessionListItemProps {
  className?: string;
  id: string;
  name: string;
  note?: string;
  userName: string;
  startTime: Date;
  endTime: Date;
}

export const SessionListItem = memo(function SessionListItem({
  className,
  id,
  name,
  note,
  userName,
  startTime,
  endTime,
}: SessionListItemProps) {
  const router = useRouter();
  const navigateToDetail = useCallback(
    (sessionId: string) => {
      router.push(`/session/${sessionId}`);
    },
    [router]
  );

  const duration = useMemo(() => {
    const diff = endTime.getTime() - startTime.getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  }, [startTime, endTime]);

  return (
    <TouchableOpacity
      className={cn('mb-4', className)}
      activeOpacity={0.7}
      onPress={() => navigateToDetail(id)}>
      <Card>
        <CardHeader className='flex-row items-center justify-between pb-2'>
          <CardTitle className='text-xl text-primary'>{name}</CardTitle>
          <Ionicons name='chevron-forward-outline' size={20} className='text-muted' />
        </CardHeader>
        <CardContent
          className={cn('gap-1', {
            'pb-2': note,
          })}>
          <View className='flex-row gap-3'>
            <Ionicons name='person-outline' size={24} className='text-foreground' />
            <Text variant='subhead'>{userName}</Text>
          </View>
          <View className='flex-row gap-3'>
            <Ionicons name='calendar-outline' size={24} className='text-foreground' />
            <Text variant='callout'>{longDateFormatter.format(startTime)}</Text>
          </View>
          <View className='flex-row items-center gap-3'>
            <Ionicons name='time-outline' size={24} className='text-foreground' />
            <Text variant='callout'>
              {shortTimeFormatter.format(startTime)}
              {' - '}
              {shortTimeFormatter.format(endTime)}
            </Text>
            <View className='ml-2 rounded-full bg-purple-100 px-2 py-0.5'>
              <Text variant='subhead' className='text-xs text-purple-800'>
                {duration}
              </Text>
            </View>
          </View>
        </CardContent>
        {note && (
          <CardFooter className='mx-6 items-start border-t border-border px-0 pt-2'>
            <Text variant='subhead' color='tertiary' numberOfLines={2}>
              {note}
            </Text>
          </CardFooter>
        )}
      </Card>
    </TouchableOpacity>
  );
});
