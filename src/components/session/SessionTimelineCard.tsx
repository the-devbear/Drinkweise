import { Card, CardContent, CardHeader, CardTitle } from '@drinkweise/ui/Card';
import { Text } from '@drinkweise/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

interface SessionTimelineCardProps {
  sessionConsumptions: {
    id: number;
    name: string;
    type: string;
    alcohol: number;
    volume: number;
    startTime: string;
    endTime: string;
  }[];
}

export function SessionTimelineCard({ sessionConsumptions }: SessionTimelineCardProps) {
  const timelineData = Object.entries(
    sessionConsumptions.reduce(
      (acc, drink) => {
        // Group drinks by their start time
        if (!acc[drink.startTime]) {
          acc[drink.startTime] = [];
        }
        acc[drink.startTime]?.push({
          id: drink.id,
          type: drink.type,
          name: drink.name,
          volume: drink.volume,
          alcohol: drink.alcohol,
        });
        return acc;
      },
      {} as Record<
        string,
        { id: number; type: string; name: string; volume: number; alcohol: number }[]
      >
    )
  ).map(([time, drinks]) => ({ time, drinks }));
  return (
    <Card className='mx-4'>
      <CardHeader>
        <CardTitle className='font-bold text-gray-600 dark:text-gray-300'>
          Consumption Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        {timelineData.map((timePoint) => (
          <TimelinePoint key={timePoint.time} time={timePoint.time} drinks={timePoint.drinks} />
        ))}
      </CardContent>
    </Card>
  );
}

interface Drink {
  id: number;
  name: string;
  type: string;
  volume: number; // in ml
  alcohol: number; // in percentage
}

function TimelinePoint({ time, drinks }: { time: string; drinks: Drink[] }) {
  return (
    // TODO: extract to component
    <View key={time} className='mb-0'>
      <View className='ml-2 border-l-2 border-blue-200/60 pl-4 dark:border-blue-500/30'>
        <View className='mb-1 flex-row'>
          <View className='absolute -left-6 h-4 w-4 rounded-full bg-blue-500 dark:bg-blue-500' />
          <Text className='text-sm font-semibold text-gray-700 dark:text-gray-200'>
            {new Date(time).toLocaleTimeString('default', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
        {drinks.map((consumption) => (
          <View key={consumption.id} className='mb-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800'>
            <View className=' flex-row items-center justify-between'>
              <View className='flex-1 flex-row items-center'>
                {/* TODO: Icons for all types  */}
                <Ionicons
                  name={consumption.type === 'beer' ? 'beer-outline' : 'wine-outline'}
                  className='mr-2 text-[28px] text-amber-500 dark:text-amber-400'
                />
                <View className='flex-1'>
                  <Text className='font-medium text-gray-900 dark:text-white'>
                    {consumption.name}
                  </Text>
                  <Text className='text-xs text-gray-500 dark:text-gray-400'>
                    {consumption.volume} ml
                  </Text>
                </View>
              </View>
              <Text className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                {consumption.alcohol} %
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
