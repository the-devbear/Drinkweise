import { authService, type UserModel } from '@drinkweise/api/user';
import { Env } from '@drinkweise/lib/environment';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { useEffect } from 'react';
import { Alert } from 'react-native';

interface GoogleAuthButtonProps {
  onSuccessfulSignIn: (user: UserModel) => Promise<void> | void;
}

export function GoogleAuthButton({ onSuccessfulSignIn }: GoogleAuthButtonProps) {
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
        try {
          const { value, error } = await authService.signInWithGoogle();

          if (error) {
            if ('type' in error) {
              return;
            }

            Alert.alert('Error', error.message);
            return;
          }

          await onSuccessfulSignIn(value);
        } catch (error) {
          console.error('Error signing in with Google', error);
          Alert.alert('Error', 'An unexpected error occurred. Please try again.');
        }
      }}
    />
  );
}
