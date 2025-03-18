import { Button } from '@drinkweise/components/ui/Button';
import { Text } from '@drinkweise/components/ui/Text';
import { useAppDispatch } from '@drinkweise/store';
import { signOutAction } from '@drinkweise/store/user/actions/sign-out.action';
import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function Home() {
  const dispatch = useAppDispatch();
  return (
    <>
      <Stack.Screen options={{ title: 'Tab Two' }} />
      <View style={styles.container}>
        <Text>Tab Two</Text>
        <Button onPress={() => dispatch(signOutAction())}>
          <Text>Sign Out</Text>
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
