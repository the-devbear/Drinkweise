import type { Drink } from '@drinkweise/store/drink-session/models/drink.model';
import { FlashList } from '@shopify/flash-list';
import React from 'react';

import { AddDrinkListItem } from './AddDrinkListItem';

interface DrinkListProps {
  data: Omit<Drink, 'consumptions'>[];
}

export function AddDrinkList({ data }: DrinkListProps) {
  return (
    <FlashList
      data={data}
      keyExtractor={(item) => item.id}
      estimatedItemSize={84}
      keyboardShouldPersistTaps='handled'
      keyboardDismissMode='on-drag'
      contentContainerStyle={{ paddingBottom: 50 }}
      renderItem={({ item }) => <AddDrinkListItem drink={item} />}
    />
  );
}
