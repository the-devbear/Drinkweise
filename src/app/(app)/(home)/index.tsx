import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@drinkweise/components/ui/Card';
import { Text } from '@drinkweise/components/ui/Text';
import { Tables } from '@drinkweise/lib/types/generated/supabase.types';
import { shortTimeFormatter } from '@drinkweise/lib/utils/date/time-formatter';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { View, FlatList, TouchableOpacity } from 'react-native';

const FAKE_DATA: (Tables<'drink_sessions'> & { username: string })[] = [
  {
    id: '1',
    user_id: 'user_1',
    username: 'John Doe',
    name: 'Session 1',
    note: 'Ab sit officia aliquid debitis dolor a porro. Provident voluptas nobis possimus. Dolorem consectetur animi culpa magnam. Ea alias reiciendis. Veniam tempore earum quasi ut.',
    start_time: '2023-10-01T10:00:00Z',
    end_time: '2023-10-01T12:00:00Z',
    created_at: '2023-10-01T09:00:00Z',
  },
  {
    id: '2',
    user_id: 'user_2',
    username: 'Jane Smith',
    name: 'Session 2',
    note: 'Note 2',
    start_time: '2023-10-02T10:00:00Z',
    end_time: '2023-10-02T12:00:00Z',
    created_at: '2023-10-02T09:00:00Z',
  },
  {
    id: '3',
    user_id: 'user_3',
    username: 'Alice Johnson',
    name: 'Session 3',
    note: 'Note 3',
    start_time: '2023-10-03T20:00:00Z',
    end_time: '2023-10-04T02:00:00Z',
    created_at: '2023-10-03T09:00:00Z',
  },
];

export default function HomePage() {
  const router = useRouter();

  const navigateToDetail = (sessionId: string) => {
    router.push(`/(app)/(home)/session/${sessionId}`);
  };

  const renderDrinkSession = ({ item }: { item: (typeof FAKE_DATA)[number] }) => {
    const startDate = new Date(item.start_time);
    const endDate = new Date(item.end_time);
    const duration = endDate.getTime() - startDate.getTime();
    const sessionName = item.name || 'Unnamed Session';

    return (
      <TouchableOpacity
        className='mb-4'
        activeOpacity={0.7}
        onPress={() => navigateToDetail(item.id)}>
        <Card>
          <CardHeader className='flex-row items-center justify-between pb-2'>
            <CardTitle className='text-xl'>{sessionName}</CardTitle>
            <Ionicons name='chevron-forward-outline' size={20} className='text-muted' />
          </CardHeader>
          <CardContent className='gap-1 pb-2'>
            <View className='flex-row gap-3'>
              <Ionicons name='person-outline' size={24} className='text-foreground' />
              <Text variant='subhead'>{item.username}</Text>
            </View>
            <View className='flex-row gap-3'>
              <Ionicons name='calendar-outline' size={24} className='text-foreground' />
              <Text variant='callout'>
                {startDate.toLocaleDateString('default', {
                  month: 'short',
                  day: '2-digit',
                  year: 'numeric',
                })}
              </Text>
            </View>
            <View className='flex-row items-center gap-3'>
              <Ionicons name='time-outline' size={24} className='text-foreground' />
              <Text variant='callout'>
                {shortTimeFormatter.format(startDate)}
                {' - '}
                {shortTimeFormatter.format(endDate)}
              </Text>
              <View className='ml-2 rounded-full bg-purple-100 px-2 py-0.5'>
                <Text variant='subhead' className='text-xs text-purple-800'>
                  {Math.floor(duration / 3600000)}h {Math.floor((duration % 3600000) / 60000)}m
                </Text>
              </View>
            </View>
          </CardContent>
          <CardFooter className='mx-6 mt-2 items-start border-t border-border px-0 pt-2'>
            <Text
              variant='subhead'
              color='tertiary'
              style={{ wordWrap: 'break-word' }}
              numberOfLines={2}>
              {item.note ? item.note : 'No notes available'}
            </Text>
          </CardFooter>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View className='flex-1 '>
      <FlatList
        data={FAKE_DATA}
        className='p-4'
        renderItem={renderDrinkSession}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
