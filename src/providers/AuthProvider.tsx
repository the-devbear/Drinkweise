import { supabase } from '@drinkweise/lib/supabase';
import { rootStore, useAppDispatch, useAppSelector } from '@drinkweise/store';
import { selectUser, supabaseSignOutAction, updateUserSessionAction } from '@drinkweise/store/user';
import { useNetInfo } from '@react-native-community/netinfo';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { useRouter, useSegments } from 'expo-router';
import React, { useEffect, useCallback, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

interface AuthProviderProps {
  children: React.ReactNode;
}

const useInitializeSupabaseSession = () => {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    const session = rootStore.getState().user.session;
    if (!session) return;

    supabase.auth
      .setSession({
        access_token: session.accessToken,
        refresh_token: session.refreshToken,
      })
      .then(({ error }) => {
        if (error) {
          console.error('Failed to set Supabase session:', error);
        } else {
          console.log('Supabase session initialized successfully');
        }
      });

    initialized.current = true;
  }, []);
};

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const segments = useSegments();
  const { isInternetReachable } = useNetInfo();
  const user = useAppSelector(selectUser);
  const isAuthRoute = segments[0] === '(auth)';

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

    // const {
    //   data: { subscription: authSubscription },
    // } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      // authSubscription.unsubscribe();
      appStateSubscription.remove();
    };
  }, [isInternetReachable, handleAuthStateChange, handleAppStateChange]);

  useInitializeSupabaseSession();

  useEffect(() => {
    if (!user && !isAuthRoute) {
      console.log('[ROUTE] Redirecting to sign-in (no user) ');
      router.replace('/(auth)/sign-in');
      return;
    }

    if (user && !user.hasCompletedOnboarding) {
      // TODO: Will be implemented in DRINK-13
      console.log('[ROUTE] User needs to complete onboarding');
    }

    if (user && isAuthRoute) {
      console.log('[ROUTE] Redirecting to home (user already signed in)');
      router.replace('/');
    }
  }, [router, user, isAuthRoute]);

  return <>{children}</>;
}
