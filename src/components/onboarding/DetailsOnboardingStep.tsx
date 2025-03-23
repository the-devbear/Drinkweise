import { OnboardingFormControl } from '@drinkweise/lib/forms/onboarding';
import { BottomSheetPicker } from '@drinkweise/ui/BottomSheetPicker';
import { Text } from '@drinkweise/ui/Text';
import { TextInput } from '@drinkweise/ui/TextInput';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { View } from 'react-native';

import { ExpandableDetailsInfoCard } from './ExpandableDetailsInfoCard';

export interface DetailsOnboardingStepProps {
  control: OnboardingFormControl;
}

export function DetailsOnboardingStep({ control }: DetailsOnboardingStepProps) {
  const [infoExpanded, setInfoExpanded] = useState(false);

  return (
    <View className='flex-1 gap-5 p-5 pt-10'>
      <Text variant='title2' className='font-semibold'>
        Complete your profile
      </Text>
      <ExpandableDetailsInfoCard infoExpanded={infoExpanded} setInfoExpanded={setInfoExpanded} />
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
            onFocus={() => setInfoExpanded(false)}
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
            onFocus={() => setInfoExpanded(false)}
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
