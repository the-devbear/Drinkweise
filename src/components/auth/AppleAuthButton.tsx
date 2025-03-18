import { AppleAuthErrorsKeys } from '@drinkweise/api/user/enums/apple-auth-errors';
import { useColorScheme } from '@drinkweise/lib/useColorScheme';
import { isSerializedCodedError } from '@drinkweise/lib/utils/redux/is-serialize-error';
import { useAppDispatch } from '@drinkweise/store';
import { signInWithAppleAction } from '@drinkweise/store/user/actions/sign-in-with-apple.action';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Alert, Platform } from 'react-native';

export function AppleAuthButton() {
  const { isDarkColorScheme } = useColorScheme();
  const dispatch = useAppDispatch();
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
        const response = await dispatch(signInWithAppleAction());

        if (signInWithAppleAction.fulfilled.match(response)) {
          return;
        }

        const { payload: error } = response;

        if (
          isSerializedCodedError(error) &&
          error.code === AppleAuthErrorsKeys.ERR_REQUEST_CANCELED
        ) {
          return;
        }

        Alert.alert('Error', error?.message ?? 'An unexpected error occurred');
      }}
    />
  );
}
