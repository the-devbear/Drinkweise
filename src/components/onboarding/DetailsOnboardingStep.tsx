import { OnboardingFormControl } from '@drinkweise/lib/forms/onboarding';
import { Text } from '@drinkweise/ui/Text';
import { TextInput } from '@drinkweise/ui/TextInput';
import { Ionicons } from '@expo/vector-icons';
import { Controller } from 'react-hook-form';
import { View } from 'react-native';

import { BottomSheetPicker } from '../ui/BottomSheetPicker';

export interface DetailsOnboardingStepProps {
  control: OnboardingFormControl;
}

export function DetailsOnboardingStep({ control }: DetailsOnboardingStepProps) {
  return (
    <View className='flex-1 gap-5 p-5 pt-10'>
      <Text variant='title2' className='font-semibold'>
        Complete your profile
      </Text>
      {/* TODO: make it expandable */}
      <View className='gap-2 rounded-lg bg-blue-200 p-3'>
        {/* <Text variant='title3' className='font-medium'> */}
        <View className='flex-row items-center justify-between'>
          <Text variant='heading'>Why do we need this information?</Text>
          <Ionicons size={20} name='chevron-up' />
        </View>
        <Text className='text-sm text-gray-800 dark:text-gray-200'>
          {/* TODO: more text */}
          We use this information to provide you with personalized recommendations and insights.
        </Text>
      </View>
      <Controller
        control={control}
        name='height'
        render={({ field: { onBlur, onChange, value, ref }, fieldState: { error } }) => (
          <TextInput
            ref={ref}
            label='Height'
            placeholder='Enter your height'
            keyboardType='numeric'
            textContentType='none'
            clearButtonMode='while-editing'
            autoCapitalize='none'
            autoCorrect={false}
            onChangeText={(value) => {
              // TODO: This needs to be improved
              const parsedValue = parseInt(value, 10);
              if (isNaN(parsedValue)) {
                onChange(null);
              } else {
                onChange(parsedValue);
              }
            }}
            onBlur={onBlur}
            value={value?.toString()}
            errorMessage={error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name='weight'
        render={({ field: { onBlur, onChange, value, ref }, fieldState: { error } }) => (
          <TextInput
            ref={ref}
            label='Weight'
            placeholder='Enter your weight'
            keyboardType='numeric'
            clearButtonMode='while-editing'
            onChangeText={(value) => {
              // TODO: This needs to be improved
              const parsedValue = parseFloat(value);
              if (isNaN(parsedValue)) {
                onChange(null);
              } else {
                onChange(parsedValue);
              }
            }}
            onBlur={onBlur}
            value={value?.toString()}
            errorMessage={error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name='gender'
        render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
          <BottomSheetPicker
            selectedValue={value}
            onItemSelected={(item) => onChange(item.value)}
            onDismiss={onBlur}
            label='Gender'
            errorMessage={error?.message}
            placeholder='Select your gender'
            items={[
              {
                value: 'male',
                label: 'Male',
              },
              {
                label: 'Female',
                value: 'female',
              },
              {
                label: 'Other',
                value: 'other',
              },
            ]}
          />
        )}
      />
    </View>
  );
}
