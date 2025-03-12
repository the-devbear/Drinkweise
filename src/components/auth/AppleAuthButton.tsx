import { authService, UserModel } from '@drinkweise/api/user';
import { AppleAuthErrorsKeys } from '@drinkweise/api/user/enums/apple-auth-errors';
import { useColorScheme } from '@drinkweise/lib/useColorScheme';
import { isCodedError } from '@drinkweise/lib/utils/error/is-coded-error';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Alert, Platform } from 'react-native';

interface AppleAuthButtonProps {
  onSuccessfulSignIn: (user: UserModel) => Promise<void> | void;
}

export function AppleAuthButton({ onSuccessfulSignIn }: AppleAuthButtonProps) {
  const { isDarkColorScheme } = useColorScheme();
  if (Platform.OS !== 'ios') {
    return null;
  }

  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
      buttonStyle={
        isDarkColorScheme
          ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
          : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
      }
      cornerRadius={5}
      style={{ width: 300, height: 40 }}
      onPress={async () => {
        const { value, error } = await authService.signInWithApple();

        if (value) {
          await onSuccessfulSignIn(value);
          return;
        }

        if (isCodedError(error)) {
          if (error.code === AppleAuthErrorsKeys.ERR_REQUEST_CANCELED) {
            return;
          }
        }

        Alert.alert('Error', error.message);
      }}
    />
  );
}
