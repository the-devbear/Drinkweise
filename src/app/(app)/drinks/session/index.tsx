import { DrinkSessionDrinkItem } from '@drinkweise/components/session/DrinkSessionDrinkItem';
import { DrinkSessionFooter } from '@drinkweise/components/session/DrinkSessionFooter';
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
} from '@drinkweise/store/drink-session';
import type { DrinkModel } from '@drinkweise/store/drink-session/models/drink.model';
import { FlashList } from '@shopify/flash-list';
import { Redirect, Stack, useRouter } from 'expo-router';
import { useCallback, useRef } from 'react';
import { Alert, KeyboardAvoidingView, Platform } from 'react-native';

export default function SessionPage() {
  const router = useRouter();
  const drinks = useAppSelector(drinksSelector);
  const dispatch = useAppDispatch();
  const ref = useRef<FlashList<DrinkModel>>(null);

  const handleCompleteSession = useCallback(
    (drinks: DrinkModel[]) => {
      const sessionValidationResult = validateSessionCompletion(drinks);

      if (sessionValidationResult === null) {
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
                  ref.current?.scrollToItem({
                    item: drink,
                    animated: true,
                  });
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
                onPress: () => {
                  ref.current?.scrollToItem({
                    item: drink,
                    animated: true,
                  });
                },
              },
              {
                text: 'Finish all',
                onPress: () => {
                  dispatch(finishAllOpenConsumptionsAction());
                  router.navigate('/drinks/session/complete');
                },
              },
            ]
          );
          return;
        default:
          never(sessionValidationError);
      }
    },
    [router, dispatch]
  );

  if (!drinks) {
    return <Redirect href='/drinks' />;
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Button variant='plain' size='sm' onPress={() => handleCompleteSession(drinks)}>
              <Text className='text-primary'>Drink Up</Text>
            </Button>
          ),
        }}
      />
      <KeyboardAvoidingView
        className='flex-1'
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <FlashList
          ref={ref}
          data={drinks}
          keyboardShouldPersistTaps='handled'
          keyboardDismissMode='on-drag'
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <DrinkSessionDrinkItem drink={item} />}
          ListFooterComponent={<DrinkSessionFooter />}
        />
      </KeyboardAvoidingView>
    </>
  );
}
