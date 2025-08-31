import { Button } from '@drinkweise/components/ui/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@drinkweise/components/ui/Card';
import { Text } from '@drinkweise/components/ui/Text';
import { useAppDispatch, useAppSelector } from '@drinkweise/store';
import {
  isDrinkSessionActiveSelector,
  startDrinkSessionAction,
} from '@drinkweise/store/drink-session';
import * as Notifications from 'expo-notifications';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Alert, Linking, ScrollView, TouchableOpacity } from 'react-native';
import { useMMKVBoolean } from 'react-native-mmkv';

export default function DrinksPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [alreadyAsked, setAlreadyAsked] = useMMKVBoolean('user.notifications');

  const isDrinkSessionActive = useAppSelector(isDrinkSessionActiveSelector);

  useFocusEffect(
    useCallback(() => {
      if (isDrinkSessionActive) {
        router.dismissTo('/drinks/session');
      }
    }, [isDrinkSessionActive, router])
  );

  const startDrinkSession = useCallback(async () => {
    const permissions = await Notifications.getPermissionsAsync();
    if (!permissions.granted) {
      const requestedPermissions = await Notifications.requestPermissionsAsync();

      if (!requestedPermissions.granted && !alreadyAsked) {
        Alert.alert(
          'Enable Drink Reminders',
          'Get gentle reminders to log your drinks and stay on track with your session.',
          [
            {
              text: 'No, Thanks',
              style: 'cancel',
              onPress: () => {
                setAlreadyAsked(true);
                dispatch(startDrinkSessionAction());
              },
            },
            {
              text: 'Open Settings',
              isPreferred: true,
              onPress: () => {
                setAlreadyAsked(true);
                Linking.openSettings();
                dispatch(startDrinkSessionAction());
              },
            },
          ]
        );
        return;
      }
    }

    dispatch(startDrinkSessionAction());
  }, [dispatch, alreadyAsked, setAlreadyAsked]);

  return (
    <ScrollView className='p-3'>
      <TouchableOpacity onPress={startDrinkSession} activeOpacity={0.5}>
        <Card>
          <CardHeader>
            <CardTitle className='text-xl'>Open your Tab!</CardTitle>
            <CardDescription className='text-base'>
              Keep track of your drinks and enjoy responsibly.
            </CardDescription>
          </CardHeader>
          <CardContent className='gap-4'>
            <Button onPress={startDrinkSession}>
              <Text>Begin Session</Text>
            </Button>
          </CardContent>
        </Card>
      </TouchableOpacity>
    </ScrollView>
  );
}
