import { calculateSessionDuration } from '@drinkweise/lib/drink-session/calculate-session-duration';
import { shortTimeFormatter } from '@drinkweise/lib/utils/date/time-formatter';
import { Avatar, AvatarFallback, AvatarImage } from '@drinkweise/ui/Avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@drinkweise/ui/Card';
import { Text } from '@drinkweise/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, TouchableOpacity, View } from 'react-native';

export interface DrinkSession {
  id: string;
  user_id: string;
  name: string;
  note: string | null;
  start_time: string; // ISO timestamp
  end_time: string; // ISO timestamp
  created_at: string; // ISO timestamp
  users: User;
  consumptions: Consumption[];
}

export interface User {
  id: string;
  gender: 'male' | 'female' | string;
  height: number;
  weight: number;
  username: string;
  created_at: string;
  updated_at: string;
  profile_picture: string | null;
  has_completed_onboarding: boolean;
}

export interface Consumption {
  id: number;
  drink: Drink;
  volume: number;
  drink_id: string;
  end_time: string;
  created_at: string;
  start_time: string;
  drink_session_id: string;
}

export interface Drink {
  id: string;
  name: string;
  type: string;
  alcohol: number;
  barcode: string | null;
  created_at: string;
  created_by: string | null;
  default_volume: number;
}

export default function SessionDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const session: DrinkSession = JSON.parse(`{
  "id": "${id}",
  "user_id": "a51a6eb1-6734-46f8-a062-9d4320b564e7",
  "name": "For testing ",
  "note": "This is my super awesome Note, since it was such a nice evening. We should defenitly do that again!!",
  "start_time": "2025-05-03T16:10:00+00:00",
  "end_time": "2025-05-04T01:11:00+00:00",
  "created_at": "2025-05-03T16:11:29.613194+00:00",
  "users": {
    "id": "a51a6eb1-6734-46f8-a062-9d4320b564e7",
    "gender": "male",
    "height": 187,
    "weight": 60,
    "username": "devbear",
    "created_at": "2025-04-27T13:08:45.276416+00:00",
    "updated_at": "2025-04-27T13:09:20.927+00:00",
    "profile_picture": null,
    "has_completed_onboarding": true
  },
  "consumptions": [
    {
      "id": 109,
      "drink": {
        "id": "0388b209-6e1d-4443-a1f2-2e9592839567",
        "name": "Heineken",
        "type": "beer",
        "alcohol": 5,
        "barcode": null,
        "created_at": "2025-04-20T09:19:37.041446+00:00",
        "created_by": "a51a6eb1-6734-46f8-a062-9d4320b564e7",
        "default_volume": 330
      },
      "volume": 330,
      "drink_id": "0388b209-6e1d-4443-a1f2-2e9592839567",
      "end_time": "2025-05-03T16:10:00+00:00",
      "created_at": "2025-05-03T16:11:29.613194+00:00",
      "start_time": "2025-05-03T16:10:00+00:00",
      "drink_session_id": "129f7e33-e9d1-4efb-ba37-ff01fbc63891"
    },
    {
      "id": 110,
      "drink": {
        "id": "0388b209-6e1d-4443-a1f2-2e9592839567",
        "name": "Heineken",
        "type": "beer",
        "alcohol": 5,
        "barcode": null,
        "created_at": "2025-04-20T09:19:37.041446+00:00",
        "created_by": "a51a6eb1-6734-46f8-a062-9d4320b564e7",
        "default_volume": 330
      },
      "volume": 330,
      "drink_id": "0388b209-6e1d-4443-a1f2-2e9592839567",
      "end_time": "2025-05-03T16:10:00+00:00",
      "created_at": "2025-05-03T16:11:29.613194+00:00",
      "start_time": "2025-05-03T16:10:00+00:00",
      "drink_session_id": "129f7e33-e9d1-4efb-ba37-ff01fbc63891"
    },
    {
      "id": 113,
      "drink": {
        "id": "b4c5d6e7-f8a9-0123-4567-d6e7f8a90123",
        "name": "Kronenbourg 1664",
        "type": "beer",
        "alcohol": 5.4,
        "barcode": "5000213020228",
        "created_at": "2025-04-20T10:11:30.345678+00:00",
        "created_by": null,
        "default_volume": 500
      },
      "volume": 500,
      "drink_id": "b4c5d6e7-f8a9-0123-4567-d6e7f8a90123",
      "end_time": "2025-05-03T16:11:00+00:00",
      "created_at": "2025-05-03T16:11:29.613194+00:00",
      "start_time": "2025-05-03T16:11:00+00:00",
      "drink_session_id": "129f7e33-e9d1-4efb-ba37-ff01fbc63891"
    },
    {
      "id": 114,
      "drink": {
        "id": "b4c5d6e7-f8a9-0123-4567-d6e7f8a90123",
        "name": "Kronenbourg 1664",
        "type": "beer",
        "alcohol": 5.4,
        "barcode": "5000213020228",
        "created_at": "2025-04-20T10:11:30.345678+00:00",
        "created_by": null,
        "default_volume": 500
      },
      "volume": 500,
      "drink_id": "b4c5d6e7-f8a9-0123-4567-d6e7f8a90123",
      "end_time": "2025-05-03T16:11:00+00:00",
      "created_at": "2025-05-03T16:11:29.613194+00:00",
      "start_time": "2025-05-03T16:11:00+00:00",
      "drink_session_id": "129f7e33-e9d1-4efb-ba37-ff01fbc63891"
    },
    {
      "id": 115,
      "drink": {
        "id": "c3d4e5f6-a7b8-9012-c3d4-e5f6a7b89012",
        "name": "Peroni",
        "type": "beer",
        "alcohol": 4.5,
        "barcode": "8000123456789",
        "created_at": "2025-04-20T09:27:05.789012+00:00",
        "created_by": null,
        "default_volume": 330
      },
      "volume": 330,
      "drink_id": "c3d4e5f6-a7b8-9012-c3d4-e5f6a7b89012",
      "end_time": "2025-05-03T16:11:00+00:00",
      "created_at": "2025-05-03T16:11:29.613194+00:00",
      "start_time": "2025-05-03T16:11:00+00:00",
      "drink_session_id": "129f7e33-e9d1-4efb-ba37-ff01fbc63891"
    },
    {
      "id": 116,
      "drink": {
        "id": "c3d4e5f6-a7b8-9012-c3d4-e5f6a7b89012",
        "name": "Peroni",
        "type": "beer",
        "alcohol": 4.5,
        "barcode": "8000123456789",
        "created_at": "2025-04-20T09:27:05.789012+00:00",
        "created_by": null,
        "default_volume": 330
      },
      "volume": 330,
      "drink_id": "c3d4e5f6-a7b8-9012-c3d4-e5f6a7b89012",
      "end_time": "2025-05-03T16:11:00+00:00",
      "created_at": "2025-05-03T16:11:29.613194+00:00",
      "start_time": "2025-05-03T16:11:00+00:00",
      "drink_session_id": "129f7e33-e9d1-4efb-ba37-ff01fbc63891"
    },
    {
      "id": 108,
      "drink": {
        "id": "0388b209-6e1d-4443-a1f2-2e9592839567",
        "name": "Heineken",
        "type": "beer",
        "alcohol": 5,
        "barcode": null,
        "created_at": "2025-04-20T09:19:37.041446+00:00",
        "created_by": "a51a6eb1-6734-46f8-a062-9d4320b564e7",
        "default_volume": 330
      },
      "volume": 500,
      "drink_id": "0388b209-6e1d-4443-a1f2-2e9592839567",
      "end_time": "2025-05-03T16:10:00+00:00",
      "created_at": "2025-05-03T16:11:29.613194+00:00",
      "start_time": "2025-05-03T16:10:00+00:00",
      "drink_session_id": "129f7e33-e9d1-4efb-ba37-ff01fbc63891"
    },
    {
      "id": 111,
      "drink": {
        "id": "a7b8c9d0-e1f2-3456-7890-c9d0e1f23456",
        "name": "Coke Zero",
        "type": "soft drink",
        "alcohol": 0,
        "barcode": "5449000131805",
        "created_at": "2025-04-20T10:03:55.123456+00:00",
        "created_by": null,
        "default_volume": 330
      },
      "volume": 200,
      "drink_id": "a7b8c9d0-e1f2-3456-7890-c9d0e1f23456",
      "end_time": "2025-05-03T16:11:00+00:00",
      "created_at": "2025-05-03T16:11:29.613194+00:00",
      "start_time": "2025-05-04T01:11:00+00:00",
      "drink_session_id": "129f7e33-e9d1-4efb-ba37-ff01fbc63891"
    },
    {
      "id": 112,
      "drink": {
        "id": "a7b8c9d0-e1f2-3456-7890-c9d0e1f23456",
        "name": "Coke Zero",
        "type": "soft drink",
        "alcohol": 0,
        "barcode": "5449000131805",
        "created_at": "2025-04-20T10:03:55.123456+00:00",
        "created_by": null,
        "default_volume": 330
      },
      "volume": 250,
      "drink_id": "a7b8c9d0-e1f2-3456-7890-c9d0e1f23456",
      "end_time": "2025-05-03T16:11:00+00:00",
      "created_at": "2025-05-03T16:11:29.613194+00:00",
      "start_time": "2025-05-03T16:11:00+00:00",
      "drink_session_id": "129f7e33-e9d1-4efb-ba37-ff01fbc63891"
    }
  ]
}`);

  const timelineData = Object.entries(
    session.consumptions
      .sort((a, b) => a.start_time.localeCompare(b.start_time))
      .reduce(
        (acc, drink) => {
          // TODO: probably check if hours and minute are the same
          if (!acc[drink.start_time]) {
            acc[drink.start_time] = [];
          }
          acc[drink.start_time]?.push(drink);
          return acc;
        },
        {} as Record<string, Consumption[]>
      )
  ).map(([time, value]) => ({ time, drinks: value }));

  return (
    // TODO: Check if flashlist is better
    <ScrollView className='flex-col gap-4' contentContainerClassName='gap-4 pb-20'>
      <View className='gap-4 bg-card p-4 pt-8'>
        <View className='flex-row items-start justify-between'>
          <View className='flex-1'>
            <Text className='mr-2 flex-1 text-2xl font-bold text-gray-900 dark:text-white'>
              {session.name}
            </Text>
            <View className='mt-1 flex-row items-center gap-2'>
              <Ionicons name='calendar-outline' size={20} color='gray' />
              <Text className='text-gray-700 dark:text-gray-300'>
                {new Date(session.start_time).toLocaleDateString()}
              </Text>
            </View>
          </View>
          <TouchableOpacity className='flex-row items-center gap-2'>
            <Avatar alt='User Avatar'>
              <AvatarImage
                source={{
                  uri: session.users.profile_picture ?? undefined,
                }}
              />
              <AvatarFallback>
                <Text className='text-sm font-medium text-gray-800 dark:text-gray-300'>
                  {session.users.username.slice(0, 2).toUpperCase()}
                </Text>
              </AvatarFallback>
            </Avatar>
            <Text className='space-x-2 truncate text-sm font-semibold text-gray-600 dark:text-gray-300'>
              {session.users.username}
            </Text>
          </TouchableOpacity>
        </View>
        {session.note && (
          <View className='rounded-lg bg-gray-50 p-3 dark:bg-gray-800'>
            <View className='mb-1 flex-row items-center'>
              <Ionicons
                className='mr-1 text-[16px] text-gray-600 dark:text-gray-300'
                name='book-outline'
              />
              <Text className='text-base font-semibold text-gray-600 dark:text-gray-300'>Note</Text>
            </View>
            <Text className='text-sm text-gray-700 dark:text-gray-300'>{session.note}</Text>
          </View>
        )}
      </View>
      <Card className='mx-4'>
        <CardHeader>
          <CardTitle className='font-bold text-gray-600 dark:text-gray-300'>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <View className='flex'>
            <View className='flex-row justify-around'>
              <View className='items-center'>
                <Text className='text-xs uppercase text-gray-500 dark:text-gray-400'>Start</Text>
                <Text className='text-sm font-semibold text-gray-700 dark:text-gray-200'>
                  {shortTimeFormatter.format(new Date(session.start_time))}
                </Text>
              </View>
              <View className='items-center'>
                <Text className='text-xs uppercase text-gray-500 dark:text-gray-400'>End</Text>
                <Text className='text-sm font-semibold text-gray-700 dark:text-gray-200'>
                  {shortTimeFormatter.format(new Date(session.end_time))}
                </Text>
              </View>
              <View className='items-center'>
                <Text className='text-xs uppercase text-gray-500 dark:text-gray-400'>Duration</Text>
                <Text className='text-sm font-semibold text-gray-700 dark:text-gray-200'>
                  {calculateSessionDuration(
                    new Date(session.start_time).getTime(),
                    new Date(session.end_time).getTime()
                  )}
                </Text>
              </View>
            </View>
            <View className='mt-3 flex-row gap-3'>
              <View className='flex-1 rounded-lg bg-blue-50 p-3 dark:bg-blue-950/50'>
                <View className='flex-row items-center'>
                  <Ionicons
                    name='water-outline'
                    className='mr-2 text-[20px] text-blue-600 dark:text-blue-400'
                  />
                  <Text className='text-sm text-gray-600 dark:text-gray-300'>Total Volume</Text>
                </View>
                <Text className='mt-1 text-lg font-bold text-gray-900 dark:text-white'>
                  {/* TODO: Extract */}
                  {session.consumptions.reduce((acc, curr) => acc + curr.volume, 0)} ml
                </Text>
              </View>
              <View className='flex-1 rounded-lg bg-blue-50 p-3 dark:bg-blue-950/50'>
                <View className='flex-row items-center'>
                  <Ionicons
                    name='wine-outline'
                    className='mr-2 text-[20px] text-blue-600 dark:text-blue-400'
                  />
                  <Text className='text-sm text-gray-600 dark:text-gray-300'>Total Alcohol</Text>
                </View>
                <Text className='mt-1 text-lg font-bold text-gray-900 dark:text-white'>
                  {/* TODO: use correct calculation */}
                  {session.consumptions.reduce((acc, curr) => acc + curr.volume * 0.05, 0)}g
                </Text>
              </View>
            </View>
          </View>
        </CardContent>
      </Card>
      <Card className='mx-4'>
        <CardHeader>
          <CardTitle className='font-bold text-gray-600 dark:text-gray-300'>
            Consumption Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          {timelineData.map((timePoint) => (
            // TODO: extract to component
            <View key={timePoint.time} className='mb-0'>
              <View className='ml-6 border-l-2 border-blue-200/60 pl-4 dark:border-blue-500/30'>
                <View className='mb-1 flex-row'>
                  <View className='absolute -left-6 h-4 w-4 rounded-full bg-blue-500 dark:bg-blue-500' />
                  <Text className='text-sm font-semibold text-gray-700 dark:text-gray-200'>
                    {new Date(timePoint.time).toLocaleTimeString('default', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
                {timePoint.drinks.map((consumption) => (
                  <View
                    key={consumption.id}
                    className='mb-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800'>
                    <View className=' flex-row items-center justify-between'>
                      <View className='flex-1 flex-row items-center'>
                        {/* TODO: Icons for all types  */}
                        <Ionicons
                          name={consumption.drink.type === 'beer' ? 'beer-outline' : 'wine-outline'}
                          className='mr-2 text-[28px] text-amber-500 dark:text-amber-400'
                        />
                        <View className='flex-1'>
                          <Text className='font-medium text-gray-900 dark:text-white'>
                            {consumption.drink.name}
                          </Text>
                          <Text className='text-xs text-gray-500 dark:text-gray-400'>
                            {consumption.volume} ml
                          </Text>
                        </View>
                      </View>
                      <Text className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                        {consumption.drink.alcohol} %
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </CardContent>
      </Card>
    </ScrollView>
  );
}
