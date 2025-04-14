import { DrinkSessionDrinkItem } from '@drinkweise/components/session/DrinkSessionDrinkItem';
import { DrinkSessionFooter } from '@drinkweise/components/session/DrinkSessionFooter';
import { useAppSelector } from '@drinkweise/store';
import { drinksSelector } from '@drinkweise/store/drink-session';
import { FlashList } from '@shopify/flash-list';
import { Redirect } from 'expo-router';
import { KeyboardAvoidingView, Platform } from 'react-native';

export default function SessionPage() {
  const drinks = useAppSelector(drinksSelector);

  if (!drinks) {
    return <Redirect href='/drinks' />;
  }

  return (
    <KeyboardAvoidingView
      className='flex-1'
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <FlashList
        data={drinks}
        keyboardShouldPersistTaps='handled'
        keyboardDismissMode='on-drag'
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DrinkSessionDrinkItem drink={item} />}
        ListFooterComponent={<DrinkSessionFooter />}
      />
    </KeyboardAvoidingView>
  );
}
