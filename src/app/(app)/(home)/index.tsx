import { SessionListItem } from '@drinkweise/components/session/SessionListItem';
import { useInfiniteSessionsQuery } from '@drinkweise/lib/sessions/query/use-infinite-sessions-query';
import { FlashList } from '@shopify/flash-list';
import { View } from 'react-native';

export default function HomePage() {
  const { data } = useInfiniteSessionsQuery();

  return (
    <View className='flex-1 px-4'>
      <FlashList
        data={data?.pages.flat() ?? []}
        className='py-4'
        estimatedItemSize={200}
        renderItem={({ item }) => (
          <SessionListItem
            id={item.id}
            name={item.name}
            userName={item.userName}
            startTime={new Date(item.startTime)}
            endTime={new Date(item.endTime)}
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
