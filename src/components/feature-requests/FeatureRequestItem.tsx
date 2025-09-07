import type { FeatureRequestModel } from '@drinkweise/api/feature-requests';
import { useDeleteFeatureRequestMutation, useToggleUpvoteMutation } from '@drinkweise/lib/feature-requests';
import { Button } from '@drinkweise/ui/Button';
import { Card } from '@drinkweise/ui/Card';
import { Text } from '@drinkweise/ui/Text';
import { useAppSelector } from '@drinkweise/store';
import { userIdSelector } from '@drinkweise/store/user';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, View } from 'react-native';

interface FeatureRequestItemProps {
  featureRequest: FeatureRequestModel;
}

export function FeatureRequestItem({ featureRequest }: FeatureRequestItemProps) {
  const userId = useAppSelector(userIdSelector);
  const toggleUpvoteMutation = useToggleUpvoteMutation();
  const deleteFeatureRequestMutation = useDeleteFeatureRequestMutation();

  const isOwner = userId === featureRequest.user_id;
  const isUpvoted = featureRequest.user_has_upvoted;

  const handleUpvote = () => {
    if (!userId) {
      Alert.alert('Authentication Required', 'Please sign in to upvote feature requests.');
      return;
    }
    toggleUpvoteMutation.mutate(featureRequest.id);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Feature Request',
      'Are you sure you want to delete this feature request? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteFeatureRequestMutation.mutate(featureRequest.id),
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card className='mx-6 mb-4 p-4'>
      <View className='flex-row items-start justify-between'>
        <View className='flex-1 pr-3'>
          <Text variant='heading' className='mb-2'>
            {featureRequest.title}
          </Text>
          <Text variant='body' className='mb-3 text-muted-foreground'>
            {featureRequest.description}
          </Text>
          <View className='flex-row items-center justify-between'>
            <Text variant='caption1' className='flex-1 text-muted-foreground'>
              By {featureRequest.username} • {formatDate(featureRequest.created_at)}
            </Text>
            {isOwner && (
              <Button
                variant='plain'
                size='icon'
                onPress={handleDelete}
                disabled={deleteFeatureRequestMutation.isPending}
                className='h-8 w-8'>
                <Ionicons name='trash-outline' size={16} className='text-destructive' />
              </Button>
            )}
          </View>
        </View>
        <View className='ml-3'>
          <Button
            variant={isUpvoted ? 'primary' : 'secondary'}
            size='sm'
            onPress={handleUpvote}
            disabled={toggleUpvoteMutation.isPending || !userId}
            className='min-w-[60px]'>
            <Ionicons 
              name={isUpvoted ? 'heart' : 'heart-outline'} 
              size={16} 
              className={isUpvoted ? 'text-white' : 'text-foreground'} 
            />
            <Text 
              variant='caption1' 
              className={`font-medium ${isUpvoted ? 'text-white' : 'text-foreground'}`}>
              {featureRequest.upvotes_count}
            </Text>
          </Button>
        </View>
      </View>
    </Card>
  );
}