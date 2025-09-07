import { supabase } from '@drinkweise/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

const FEATURE_REQUESTS_QUERY_KEY = 'feature-requests';

export function useFeatureRequestsRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log('🔴 Setting up feature requests real-time subscriptions...');

    // Create separate channels for better debugging
    const featureRequestsChannel = supabase
      .channel('feature_requests_channel', {
        config: {
          broadcast: { self: true },
        },
      })
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'feature_requests',
        },
        (payload) => {
          console.log('🔴 Feature request change:', {
            event: payload.eventType,
            table: payload.table,
            new: payload.new,
            old: payload.old,
          });
          
          // Invalidate all feature request queries
          queryClient.invalidateQueries({ 
            queryKey: [FEATURE_REQUESTS_QUERY_KEY],
            exact: false 
          });
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
          event: '*',
          schema: 'public',
          table: 'feature_request_upvotes',
        },
        (payload) => {
          console.log('🔴 Feature request upvote change:', {
            event: payload.eventType,
            table: payload.table,
            new: payload.new,
            old: payload.old,
          });
          
          // Invalidate all feature request queries
          queryClient.invalidateQueries({ 
            queryKey: [FEATURE_REQUESTS_QUERY_KEY],
            exact: false 
          });
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
  }, [queryClient]);
}