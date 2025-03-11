import { useColorScheme } from '@drinkweise/lib/useColorScheme';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';

// TODO
interface AppleAuthButtonProps {}

export function AppleAuthButton({}: AppleAuthButtonProps) {
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
      onPress={() => {
        console.log('AppleAuthButton onPress');
      }}
    />
  );
}
