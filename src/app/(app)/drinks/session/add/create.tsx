import { BottomSheetPicker } from '@drinkweise/ui/BottomSheetPicker';
import { Button } from '@drinkweise/ui/Button';
import { IntegerInput } from '@drinkweise/ui/IntegerInput';
import { NumberInput } from '@drinkweise/ui/NumberInput';
import { Text } from '@drinkweise/ui/Text';
import { TextInput } from '@drinkweise/ui/TextInput';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ScrollView, View } from 'react-native';

export default function CreateDrinkPage() {
  return (
    <BottomSheetModalProvider>
      <ScrollView className='flex-1'>
        <View className='flex-1 gap-2 p-5 pt-5'>
          <Text variant='title2' className='font-semibold'>
            Create a new drink
          </Text>
          <TextInput placeholder='Enter drink name' label='Name' />
          <BottomSheetPicker
            label='Type'
            selectedValue='beer'
            items={[
              {
                value: 'beer',
                label: 'Beer',
              },
            ]}
            onItemSelected={(_item) => {}}
            onDismiss={() => {}}
          />
          <NumberInput label='Alcohol Percentage (%)' placeholder='e.g. 5.0' />
          <IntegerInput label='Volume (ml)' placeholder='e.g. 500' />
          <TextInput label='Barcode' placeholder='Optional' />
          <Button className='mt-5' onPress={() => {}}>
            <Text>Create Drink</Text>
          </Button>
        </View>
      </ScrollView>
    </BottomSheetModalProvider>
  );
}
