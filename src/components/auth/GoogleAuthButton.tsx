import { UserModel } from '@drinkweise/api/user';
import { Env } from '@drinkweise/lib/environment';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';

interface GoogleAuthButtonProps {
  onSuccessfulSignIn: (user: UserModel) => Promise<void> | void;
}

export function GoogleAuthButton({ onSuccessfulSignIn }: GoogleAuthButtonProps) {
  GoogleSignin.configure({
    webClientId: Env.GOOGLE_WEB_CLIENT_ID,
    iosClientId: Env.GOOGLE_IOS_CLIENT_ID,
  });

  return (
    <GoogleSigninButton
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Light}
      onPress={async () => {
        console.log('Google sign in');
      }}
    />
  );
}
