import { SessionListItem } from '@drinkweise/components/session/SessionListItem';
import { Tables } from '@drinkweise/lib/types/generated/supabase.types';
import { View, FlatList } from 'react-native';

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
  return (
    <View className='flex-1 '>
      <FlatList
        data={FAKE_DATA}
        className='p-4'
        renderItem={({ item }) => (
          <SessionListItem
            id={item.id}
            name={item.name}
            userName={item.username}
            startTime={new Date(item.start_time)}
            endTime={new Date(item.end_time)}
            note={item.note}
          />
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
