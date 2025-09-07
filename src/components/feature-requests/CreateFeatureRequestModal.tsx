import type { CreateFeatureRequestModel } from '@drinkweise/api/feature-requests';
import { useCreateFeatureRequestMutation } from '@drinkweise/lib/feature-requests';
import { Button } from '@drinkweise/ui/Button';
import { Text } from '@drinkweise/ui/Text';
import { TextInput } from '@drinkweise/ui/TextInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, ScrollView, View } from 'react-native';
import { z } from 'zod';

const createFeatureRequestSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(1, 'Title is required')
    .max(100, 'Title is too long, max 100 characters'),
  description: z
    .string({ required_error: 'Description is required' })
    .min(1, 'Description is required')
    .max(500, 'Description is too long, max 500 characters'),
});

export function CreateFeatureRequestModal() {
  const createFeatureRequestMutation = useCreateFeatureRequestMutation();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid, isSubmitted },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
    },
    resolver: zodResolver(createFeatureRequestSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await createFeatureRequestMutation.mutateAsync(data);
      Alert.alert('Success', 'Your feature request has been submitted!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to submit your feature request. Please try again.'
      );
    }
  });

  return (
    <ScrollView className='flex-1 pt-5' keyboardDismissMode='on-drag'>
      <View className='px-3'>
        <View className='mb-4'>
          <Text variant='body' className='mb-4 text-muted-foreground'>
            Help us improve Drinkweise by suggesting new features. Before submitting, please search to see if someone has already suggested a similar feature.
          </Text>
        </View>

        <Controller
          control={control}
          name='title'
          render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
            <TextInput
              size='lg'
              inputClassName='font-semibold text-lg'
              placeholder='Brief title for your feature request'
              clearButtonMode='while-editing'
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              errorMessage={error?.message}
              maxLength={100}
            />
          )}
        />

        <Controller
          control={control}
          name='description'
          render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
            <View>
              <TextInput
                label='Description:'
                multiline
                value={value}
                className='mt-2'
                containerClassName='h-auto'
                inputClassName='min-h-24 text-start align-top text-[16px]'
                placeholder='Describe your feature request in detail. What problem would it solve? How would it work?'
                onChangeText={onChange}
                onBlur={onBlur}
                errorMessage={error?.message}
                maxLength={500}
              />
              {error?.message === undefined && (
                <Text className='mr-2 mt-1 self-end text-xs text-muted-foreground'>
                  {value?.length ?? 0} / 500 characters
                </Text>
              )}
            </View>
          )}
        />
      </View>
      <Button
        className='mx-3 mt-4'
        disabled={!isValid && isSubmitted}
        loading={isSubmitting}
        onPress={onSubmit}>
        <Text>Submit Feature Request</Text>
      </Button>
    </ScrollView>
  );
}