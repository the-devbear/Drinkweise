import { Button } from '@drinkweise/components/ui/Button';
import { Text } from '@drinkweise/components/ui/Text';
import { TextInput } from '@drinkweise/components/ui/TextInput';
import { ScrollView, View } from 'react-native';

export default function CompleteDrinkSessionPage() {
  return (
    <ScrollView>
      <View className='px-4 py-2'>
        <TextInput
          size='lg'
          inputClassName='font-semibold text-lg'
          placeholder='Give your session a memorable name'
          clearButtonMode='while-editing'
        />
        <View className='flex-row items-center gap-5 pt-3'>
          <View className='flex-1 rounded-md bg-card py-1'>
            <Text className='text-center text-sm font-semibold'>Duration</Text>
            <Text className='text-center text-sm' style={{ fontVariant: ['tabular-nums'] }}>
              1:45h
            </Text>
          </View>
          <View className='flex-1 rounded-md bg-card py-1'>
            <Text className='text-center text-sm font-semibold'>Total Alcohol</Text>
            <Text className='text-center text-sm'>25,34g</Text>
          </View>
          <View className='flex-1 rounded-lg bg-card py-1'>
            <Text className='text-center text-sm font-semibold'>Sober time</Text>
            <Text className='text-center text-sm'>23:55</Text>
          </View>
        </View>
        <TextInput
          label='Note:'
          multiline
          className='mt-2'
          containerClassName='h-auto text-start'
          inputClassName='self-start min-h-24'
          placeholder='How was your session? Leave a note here...'
        />
        <Button className='mt-4'>
          <Text>Complete</Text>
        </Button>
      </View>
    </ScrollView>
  );
}
