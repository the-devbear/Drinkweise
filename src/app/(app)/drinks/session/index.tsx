import { DrinkSessionDrinkItem } from '@drinkweise/components/session/current/DrinkSessionDrinkItem';
import { DrinkSessionFooter } from '@drinkweise/components/session/current/DrinkSessionFooter';
import { Button } from '@drinkweise/components/ui/Button';
import { Text } from '@drinkweise/components/ui/Text';
import { SessionValidationErrors } from '@drinkweise/lib/drink-session/enums/session-validation-errors';
import { validateSessionCompletion } from '@drinkweise/lib/drink-session/validate-session-completion';
import { never } from '@drinkweise/lib/utils/never';
import { useAppDispatch, useAppSelector } from '@drinkweise/store';
import {
  addConsumptionAction,
  drinksSelector,
  finishAllOpenConsumptionsAction,
  removeDrinkAction,
  updateSessionStartTimeToEarliestConsumptionAction,
} from '@drinkweise/store/drink-session';
import type { DrinkModel } from '@drinkweise/store/drink-session/models/drink.model';
import { FlashList } from '@shopify/flash-list';
import { Redirect, Stack, useRouter } from 'expo-router';
import React, { memo, useCallback } from 'react';
import { Alert, KeyboardAvoidingView, Platform } from 'react-native';

const HeaderRight = memo(function HeaderRight({ onComplete }: { onComplete: () => void }) {
  return (
    <Button variant='plain' size='sm' onPress={onComplete}>
      <Text className='text-primary'>Drink Up</Text>
    </Button>
  );
});

export default function SessionPage() {
  const router = useRouter();
  const drinks = useAppSelector(drinksSelector);
  const dispatch = useAppDispatch();

  const handleCompleteSession = useCallback(() => {
    if (!drinks) return;

    const sessionValidationResult = validateSessionCompletion(drinks);

    if (sessionValidationResult === null) {
      dispatch(updateSessionStartTimeToEarliestConsumptionAction());
      router.navigate('/drinks/session/complete');
      return;
    }

    const { error: sessionValidationError, drink } = sessionValidationResult;

    switch (sessionValidationError) {
      case SessionValidationErrors.NO_DRINKS:
        Alert.alert(
          'No drinks added',
          'Please add a drink to your session before proceeding.',
          [
            {
              text: 'OK',
              style: 'cancel',
            },
          ],
          {
            cancelable: true,
          }
        );
        return;
      case SessionValidationErrors.NO_CONSUMPTION:
        Alert.alert(
          `No consumptions for ${drink.name}`,
          'Please add at least one consumption to each drink or remove the drink before proceeding.',
          [
            {
              text: 'Add consumption',
              onPress: () => {
                dispatch(addConsumptionAction({ drinkId: drink.id }));
              },
              style: 'cancel',
            },
            {
              text: 'Remove drink',
              onPress: () => {
                dispatch(removeDrinkAction({ drinkId: drink.id }));
              },
              style: 'destructive',
            },
          ]
        );
        return;
      case SessionValidationErrors.NOT_FINISHED_ALL_CONSUMPTIONS:
        Alert.alert(
          `You have not finished all your drinks`,
          'Are you sure you want to finish up?\n\nAll uncompleted drinks will be completed with the current time.',
          [
            {
              text: 'Keep going',
              style: 'cancel',
            },
            {
              text: 'Finish all',
              onPress: () => {
                dispatch(finishAllOpenConsumptionsAction());
                dispatch(updateSessionStartTimeToEarliestConsumptionAction());
                router.navigate('/drinks/session/complete');
              },
            },
          ]
        );
        return;

      default:
        never(sessionValidationError);
    }
  }, [dispatch, drinks, router]);

  const keyExtractor = useCallback((item: DrinkModel) => item.id, []);
  const renderItem = useCallback(
    ({ item }: { item: DrinkModel }) => <DrinkSessionDrinkItem drink={item} />,
    []
  );

  if (!drinks) {
    return <Redirect href='/drinks' />;
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => <HeaderRight onComplete={handleCompleteSession} />,
        }}
      />
      <KeyboardAvoidingView
        className='flex-1'
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <FlashList
          data={drinks}
          keyboardShouldPersistTaps='handled'
          keyboardDismissMode='on-drag'
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ListFooterComponent={DrinkSessionFooter}
        />
      </KeyboardAvoidingView>
    </>
  );
}
