import { supabase } from '@drinkweise/lib/supabase';
import { useAppDispatch, useAppSelector } from '@drinkweise/store';
import {
  supabaseSignOutAction,
  updateUserSessionAction,
  userSessionSelector,
} from '@drinkweise/store/user';
import { useNetInfo } from '@react-native-community/netinfo';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import React, { useEffect, useCallback, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

interface AuthProviderProps {
  children: React.ReactNode;
}

const useInitializeSupabaseSession = () => {
  const session = useAppSelector(userSessionSelector);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    if (!session) {
      initialized.current = true;
      return;
    }

    console.log('[SUPABASE] Initializing session:', session);

    supabase.auth
      .setSession({
        access_token: session.accessToken,
        refresh_token: session.refreshToken,
      })
      .then(({ error }) => {
        if (error) {
          console.error('[SUPABASE]: Failed to set Supabase session:', error);
        } else {
          console.log('[SUPABASE]: Supabase session initialized successfully');
        }
      });

    initialized.current = true;
  }, [session]);
};

export function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();
  const { isInternetReachable } = useNetInfo();

  const handleAuthStateChange = useCallback(
    (event: AuthChangeEvent, session: Session | null) => {
      console.log('[AUTH EVENT] Event:', event);
      console.log('[AUTH EVENT] Session:', session);

      switch (event) {
        case 'INITIAL_SESSION':
        case 'SIGNED_IN':
        case 'TOKEN_REFRESHED':
          if (session) {
            dispatch(
              updateUserSessionAction({
                session: {
                  accessToken: session.access_token,
                  refreshToken: session.refresh_token,
                  expiresIn: session.expires_in,
                  expiresAt: session.expires_at,
                },
              })
            );
          }
          break;
        case 'SIGNED_OUT':
          dispatch(supabaseSignOutAction());
          break;
        default:
          console.warn('[AUTH EVENT] Unhandled event:', event);
      }
    },
    [dispatch]
  );

  // Handle app state changes (foreground/background)
  const handleAppStateChange = useCallback(
    (state: AppStateStatus) => {
      console.log('[APP STATE] State:', state);
      console.log('[APP STATE] Internet reachable:', isInternetReachable);

      // Enable auto-refresh only when app is active and internet is available
      // When the app does not have internet access, Supabase will not be able to refresh the token
      // otherwise, a sign out event would be triggered
      if (state === 'active' && isInternetReachable) {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    },
    [isInternetReachable]
  );

  useEffect(() => {
    if (isInternetReachable === null) return;

    const {
      data: { subscription: authSubscription },
    } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      authSubscription.unsubscribe();
      appStateSubscription.remove();
    };
  }, [isInternetReachable, handleAuthStateChange, handleAppStateChange]);

  useInitializeSupabaseSession();

  return <>{children}</>;
}
