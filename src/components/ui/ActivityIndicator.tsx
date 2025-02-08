import { useColorScheme } from '@drinkweise/lib/useColorScheme';
import { ActivityIndicator as RNActivityIndicator } from 'react-native';


function ActivityIndicator(props: React.ComponentPropsWithoutRef<typeof RNActivityIndicator>) {
  const { colors } = useColorScheme();
  return <RNActivityIndicator color={colors.primary} {...props} />;
}

export { ActivityIndicator };
