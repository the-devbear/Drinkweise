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

function getStatusLabel(status: string): string {
  switch (status.toLowerCase()) {
    case 'submitted':
      return 'New';
    case 'in-progress':
    case 'in_progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
    case 'rejected':
      return 'Rejected';
    case 'under-review':
    case 'under_review':
      return 'Under Review';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

function getStatusStyle(status: string): string {
  switch (status.toLowerCase()) {
    case 'submitted':
      return 'bg-blue-100 dark:bg-blue-900/30';
    case 'in-progress':
    case 'in_progress':
      return 'bg-yellow-100 dark:bg-yellow-900/30';
    case 'completed':
      return 'bg-green-100 dark:bg-green-900/30';
    case 'rejected':
      return 'bg-red-100 dark:bg-red-900/30';
    case 'under-review':
    case 'under_review':
      return 'bg-purple-100 dark:bg-purple-900/30';
    default:
      return 'bg-gray-100 dark:bg-gray-900/30';
  }
}

function getStatusTextColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'submitted':
      return 'text-blue-700 dark:text-blue-300';
    case 'in-progress':
    case 'in_progress':
      return 'text-yellow-700 dark:text-yellow-300';
    case 'completed':
      return 'text-green-700 dark:text-green-300';
    case 'rejected':
      return 'text-red-700 dark:text-red-300';
    case 'under-review':
    case 'under_review':
      return 'text-purple-700 dark:text-purple-300';
    default:
      return 'text-gray-700 dark:text-gray-300';
  }
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
        <View className='flex-1'>
          <View className='flex-row items-start justify-between'>
            <View className='flex-1 pr-3'>
              <View className='mb-2 flex-row items-center'>
                <Text variant='heading' className='flex-1'>
                  {featureRequest.title}
                </Text>
                <View className={`ml-2 rounded-full px-2 py-1 ${getStatusStyle(featureRequest.status)}`}>
                  <Text variant='caption1' className={`font-medium ${getStatusTextColor(featureRequest.status)}`}>
                    {getStatusLabel(featureRequest.status)}
                  </Text>
                </View>
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
      </View>
    </Card>
  );
}