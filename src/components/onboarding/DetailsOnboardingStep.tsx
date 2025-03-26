import { OnboardingFormControl } from '@drinkweise/lib/forms/onboarding';
import { BottomSheetPicker } from '@drinkweise/ui/BottomSheetPicker';
import { NumberInput } from '@drinkweise/ui/NumberInput';
import { Text } from '@drinkweise/ui/Text';
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
        render={({
          field: { onBlur, onChange, ref },
          fieldState: { error },
          formState: { defaultValues },
        }) => (
          <NumberInput
            ref={ref}
            label='Height (cm)'
            placeholder='Enter your height in centimeters'
            keyboardType='number-pad'
            textContentType='none'
            clearButtonMode='while-editing'
            autoCapitalize='none'
            autoCorrect={false}
            onFocus={() => setInfoExpanded(false)}
            onBlur={onBlur}
            initialValue={defaultValues?.height}
            onValueChange={onChange}
            errorMessage={error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name='weight'
        render={({
          field: { onBlur, onChange, ref },
          fieldState: { error },
          formState: { defaultValues },
        }) => (
          <NumberInput
            ref={ref}
            label='Weight (kg)'
            initialValue={defaultValues?.weight}
            placeholder='Enter your weight in kilograms'
            keyboardType='numeric'
            clearButtonMode='while-editing'
            onFocus={() => setInfoExpanded(false)}
            onValueChange={onChange}
            onBlur={onBlur}
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
