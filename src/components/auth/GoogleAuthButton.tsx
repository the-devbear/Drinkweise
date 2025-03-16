import { Env } from '@drinkweise/lib/environment';
import { useAppDispatch } from '@drinkweise/store';
import { signInWithGoogleAction } from '@drinkweise/store/user/actions/sign-in-with-google.action';
import type { UserModel } from '@drinkweise/store/user/models/user.model';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { useEffect } from 'react';
import { Alert } from 'react-native';

interface GoogleAuthButtonProps {
  onSuccessfulSignIn: (user: UserModel) => Promise<void> | void;
}

export function GoogleAuthButton({ onSuccessfulSignIn }: GoogleAuthButtonProps) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: Env.GOOGLE_WEB_CLIENT_ID,
      iosClientId: Env.GOOGLE_IOS_CLIENT_ID,
    });
  }, []);

  return (
    <GoogleSigninButton
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Light}
      onPress={async () => {
        const response = await dispatch(signInWithGoogleAction());

        if (signInWithGoogleAction.fulfilled.match(response)) {
          await onSuccessfulSignIn(response.payload.user);
          return;
        }

        const { payload: error } = response;

        if (error && 'cancelled' in error) {
          return;
        }

        Alert.alert('Error', error?.message ?? 'An unexpected error occurred.');
      }}
    />
  );
}
