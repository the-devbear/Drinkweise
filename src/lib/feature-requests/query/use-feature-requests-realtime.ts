import type { FeatureRequestModel } from '@drinkweise/api/feature-requests';
import { FeatureRequestStatus } from '@drinkweise/lib/types/feature-request-status.enum';
import { supabase } from '@drinkweise/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { useAppSelector } from '@drinkweise/store';
import { userIdSelector } from '@drinkweise/store/user';
import { useEffect } from 'react';

const FEATURE_REQUESTS_QUERY_KEY = 'feature-requests';

export function useFeatureRequestsRealtime() {
  const queryClient = useQueryClient();
  const userId = useAppSelector(userIdSelector);

  useEffect(() => {
    console.log('🔴 Setting up optimized feature requests real-time subscriptions...');

    // Helper function to update specific feature request in cache
    const updateFeatureRequestInCache = (updatedRequest: Partial<FeatureRequestModel> & { id: string }) => {
      queryClient.setQueriesData(
        { queryKey: [FEATURE_REQUESTS_QUERY_KEY], exact: false },
        (oldData: any) => {
          if (!oldData?.pages) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              data: page.data.map((request: FeatureRequestModel) =>
                request.id === updatedRequest.id
                  ? { ...request, ...updatedRequest }
                  : request
              ),
            })),
          };
        }
      );
    };

    // Helper function to add new feature request to cache
    const addFeatureRequestToCache = (newRequest: any) => {
      // Convert to our model format
      const featureRequest: FeatureRequestModel = {
        id: newRequest.id,
        title: newRequest.title,
        description: newRequest.description,
        user_id: newRequest.user_id,
        status: newRequest.status as FeatureRequestStatus,
        upvotes_count: newRequest.upvotes_count || 0,
        created_at: newRequest.created_at,
        updated_at: newRequest.updated_at,
        username: 'Loading...', // Will be resolved on next fetch
        user_has_upvoted: false,
      };

      queryClient.setQueriesData(
        { queryKey: [FEATURE_REQUESTS_QUERY_KEY], exact: false },
        (oldData: any) => {
          if (!oldData?.pages) return oldData;

          // Add to first page and sort properly
          const firstPage = oldData.pages[0];
          if (!firstPage) return oldData;

          const updatedFirstPage = {
            ...firstPage,
            data: [featureRequest, ...firstPage.data].sort((a, b) => {
              // Apply same sorting logic as in service
              const aIsRejected = a.status === FeatureRequestStatus.REJECTED;
              const bIsRejected = b.status === FeatureRequestStatus.REJECTED;
              
              if (aIsRejected && !bIsRejected) return 1;
              if (!aIsRejected && bIsRejected) return -1;
              
              if (a.upvotes_count !== b.upvotes_count) {
                return b.upvotes_count - a.upvotes_count;
              }
              
              return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            }),
          };

          return {
            ...oldData,
            pages: [updatedFirstPage, ...oldData.pages.slice(1)],
          };
        }
      );
    };

    // Helper function to remove feature request from cache
    const removeFeatureRequestFromCache = (deletedId: string) => {
      queryClient.setQueriesData(
        { queryKey: [FEATURE_REQUESTS_QUERY_KEY], exact: false },
        (oldData: any) => {
          if (!oldData?.pages) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              data: page.data.filter((request: FeatureRequestModel) => request.id !== deletedId),
            })),
          };
        }
      );
    };

    const featureRequestsChannel = supabase
      .channel('feature_requests_channel', {
        config: {
          broadcast: { self: true },
        },
      })
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'feature_requests',
        },
        (payload) => {
          console.log('🔴 New feature request:', payload.new);
          addFeatureRequestToCache(payload.new);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'feature_requests',
        },
        (payload) => {
          console.log('🔴 Feature request updated:', payload.new);
          updateFeatureRequestInCache({
            id: payload.new.id,
            title: payload.new.title,
            description: payload.new.description,
            status: payload.new.status as FeatureRequestStatus,
            upvotes_count: payload.new.upvotes_count,
            updated_at: payload.new.updated_at,
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'feature_requests',
        },
        (payload) => {
          console.log('🔴 Feature request deleted:', payload.old);
          removeFeatureRequestFromCache(payload.old.id);
        }
      )
      .subscribe((status, err) => {
        console.log('🔴 Feature requests subscription status:', status);
        if (err) {
          console.error('🔴 Feature requests subscription error:', err);
        }
      });

    const upvotesChannel = supabase
      .channel('feature_request_upvotes_channel', {
        config: {
          broadcast: { self: true },
        },
      })
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'feature_request_upvotes',
        },
        (payload) => {
          console.log('🔴 Upvote added:', payload.new);
          const { feature_request_id, user_id: upvoteUserId } = payload.new;
          
          updateFeatureRequestInCache({
            id: feature_request_id,
            upvotes_count: undefined, // Will be updated via separate query or optimistically
            user_has_upvoted: userId === upvoteUserId ? true : undefined,
          });

          // Optimistically update upvote count
          queryClient.setQueriesData(
            { queryKey: [FEATURE_REQUESTS_QUERY_KEY], exact: false },
            (oldData: any) => {
              if (!oldData?.pages) return oldData;

              return {
                ...oldData,
                pages: oldData.pages.map((page: any) => ({
                  ...page,
                  data: page.data.map((request: FeatureRequestModel) =>
                    request.id === feature_request_id
                      ? { 
                          ...request, 
                          upvotes_count: request.upvotes_count + 1,
                          user_has_upvoted: userId === upvoteUserId ? true : request.user_has_upvoted
                        }
                      : request
                  ),
                })),
              };
            }
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'feature_request_upvotes',
        },
        (payload) => {
          console.log('🔴 Upvote removed:', payload.old);
          const { feature_request_id, user_id: upvoteUserId } = payload.old;

          // Optimistically update upvote count
          queryClient.setQueriesData(
            { queryKey: [FEATURE_REQUESTS_QUERY_KEY], exact: false },
            (oldData: any) => {
              if (!oldData?.pages) return oldData;

              return {
                ...oldData,
                pages: oldData.pages.map((page: any) => ({
                  ...page,
                  data: page.data.map((request: FeatureRequestModel) =>
                    request.id === feature_request_id
                      ? { 
                          ...request, 
                          upvotes_count: Math.max(0, request.upvotes_count - 1),
                          user_has_upvoted: userId === upvoteUserId ? false : request.user_has_upvoted
                        }
                      : request
                  ),
                })),
              };
            }
          );
        }
      )
      .subscribe((status, err) => {
        console.log('🔴 Upvotes subscription status:', status);
        if (err) {
          console.error('🔴 Upvotes subscription error:', err);
        }
      });

    // Cleanup function
    return () => {
      console.log('🔴 Cleaning up feature requests real-time subscriptions...');
      supabase.removeChannel(featureRequestsChannel);
      supabase.removeChannel(upvotesChannel);
    };
  }, [queryClient, userId]);
}