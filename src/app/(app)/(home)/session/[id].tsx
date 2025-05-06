import { ActivityIndicator } from '@drinkweise/components/ui/ActivityIndicator';
import { calculateSessionDuration } from '@drinkweise/lib/drink-session/calculate-session-duration';
import { supabase } from '@drinkweise/lib/supabase';
import { shortTimeFormatter } from '@drinkweise/lib/utils/date/time-formatter';
import { delay } from '@drinkweise/lib/utils/delay';
import { Avatar, AvatarFallback, AvatarImage } from '@drinkweise/ui/Avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@drinkweise/ui/Card';
import { Text } from '@drinkweise/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, TouchableOpacity, View } from 'react-native';

export interface DrinkSession {
  id: string;
  name: string;
  note: string | null;
  start_time: string; // ISO timestamp
  end_time: string; // ISO timestamp
  users: User;
  consumptions: Consumption[];
}

export interface User {
  username: string;
  profile_picture: string | null;
}

export interface Consumption {
  id: number;
  drink: Drink;
  volume: number;
  end_time: string;
  start_time: string;
}

export interface Drink {
  name: string;
  type: string;
  alcohol: number;
  barcode: string | null;
  default_volume: number;
}

export default function SessionDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: session } = useQuery({
    queryKey: ['drink-session', id],
    queryFn: async ({ signal }) => {
      await delay(3);
      const { data, error } = await supabase
        .from('drink_sessions')
        .select(
          `
            id, 
            name,
            note,
            start_time,
            end_time,
            users:users(id, username, profile_picture),
            consumptions:consumptions(
              id,
              volume,
              start_time,
              end_time,
              drink:drinks(
                name,
                alcohol,
                type,
                barcode,
                default_volume
              )
            )
          `
        )
        .eq('id', id)
        .order('start_time', { referencedTable: 'consumptions', ascending: false })
        .abortSignal(signal)
        .single();

      if (error) throw error;
      if (!data) {
        throw new Error('No session found');
      }

      return data;
    },
  });

  if (!session) {
    return <ActivityIndicator size='large' className='pt-8' />;
  }

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
