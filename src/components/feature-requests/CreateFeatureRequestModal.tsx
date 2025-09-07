import type { CreateFeatureRequestModel } from '@drinkweise/api/feature-requests';
import { useCreateFeatureRequestMutation } from '@drinkweise/lib/feature-requests';
import { Button } from '@drinkweise/ui/Button';
import { KeyboardAvoidingPage } from '@drinkweise/ui/KeyboardAvoidingPage';
import { Text } from '@drinkweise/ui/Text';
import { TextInput } from '@drinkweise/ui/TextInput';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';

export function CreateFeatureRequestModal() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const createFeatureRequestMutation = useCreateFeatureRequestMutation();

  const isValid = title.trim().length > 0 && description.trim().length > 0;

  const handleSubmit = async () => {
    if (!isValid) {
      Alert.alert('Invalid Input', 'Please fill in both title and description.');
      return;
    }

    const request: CreateFeatureRequestModel = {
      title: title.trim(),
      description: description.trim(),
    };

    try {
      await createFeatureRequestMutation.mutateAsync(request);
      Alert.alert('Success', 'Your feature request has been submitted!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to submit your feature request. Please try again.',
      );
    }
  };

  return (
    <KeyboardAvoidingPage>
      <ScrollView className='flex-1'>
        <View className='flex-1 px-6 py-6'>
          <View className='mb-6'>
            <Text variant='largeTitle' className='mb-2 font-bold'>
              Request a Feature
            </Text>
            <Text variant='body' className='text-muted-foreground'>
              Help us improve Drinkweise by suggesting new features. Before submitting, please search to see if someone has already suggested a similar feature.
            </Text>
          </View>

          <View className='mb-4'>
            <Text variant='headline' className='mb-2 font-medium'>
              Title
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder='Brief title for your feature request'
              maxLength={100}
              multiline={false}
            />
            <Text variant='caption2' className='mt-1 text-muted-foreground'>
              {title.length}/100 characters
            </Text>
          </View>

          <View className='mb-6'>
            <Text variant='headline' className='mb-2 font-medium'>
              Description
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder='Describe your feature request in detail. What problem would it solve? How would it work?'
              maxLength={500}
              multiline
              numberOfLines={6}
              style={{ textAlignVertical: 'top', minHeight: 120 }}
            />
            <Text variant='caption2' className='mt-1 text-muted-foreground'>
              {description.length}/500 characters
            </Text>
          </View>
        </View>
      </ScrollView>

      <View className='border-t border-border bg-background p-6'>
        <View className='flex-row gap-3'>
          <Button
            variant='secondary'
            size='lg'
            onPress={() => router.back()}
            className='flex-1'
            disabled={createFeatureRequestMutation.isPending}>
            <Text>Cancel</Text>
          </Button>
          <Button
            variant='primary'
            size='lg'
            onPress={handleSubmit}
            className='flex-1'
            disabled={!isValid || createFeatureRequestMutation.isPending}
            loading={createFeatureRequestMutation.isPending}>
            <Ionicons name='send-outline' size={16} className='text-white' />
            <Text className='text-white'>Submit</Text>
          </Button>
        </View>
      </View>
    </KeyboardAvoidingPage>
  );
}