import { DrinkAvatarFallback } from '@drinkweise/components/shared/DrinkAvatarFallback';
import { buildTimelineDataFromSession } from '@drinkweise/lib/sessions/build-timeline-data-from-session';
import { ConsumptionsTimelinePointModel } from '@drinkweise/lib/sessions/models/consumptions-timeline-point.model';
import { shortTimeFormatter } from '@drinkweise/lib/utils/date/time-formatter';
import { Avatar } from '@drinkweise/ui/Avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@drinkweise/ui/Card';
import { Text } from '@drinkweise/ui/Text';
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
  const timelineData = buildTimelineDataFromSession(sessionConsumptions);
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

function TimelinePoint({ time, drinks }: ConsumptionsTimelinePointModel) {
  return (
    <View>
      <View className='ml-2 border-l-2 border-blue-200/60 pl-4 dark:border-blue-500/30'>
        <View className='mb-1 flex-row'>
          <View className='absolute -left-6 h-4 w-4 rounded-full bg-blue-500 dark:bg-blue-500' />
          <Text className='text-sm font-semibold text-gray-700 dark:text-gray-200'>
            {shortTimeFormatter.format(time)}
          </Text>
        </View>
        {drinks.map((consumption) => (
          <View key={consumption.id} className='mb-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800'>
            <View className=' flex-row items-center justify-between'>
              <View className='flex-1 flex-row items-center'>
                <Avatar className='mr-2' alt=''>
                  <DrinkAvatarFallback
                    type={consumption.type}
                    emojiClassName='text-3xl'
                    className='bg-transparent'
                  />
                </Avatar>
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
