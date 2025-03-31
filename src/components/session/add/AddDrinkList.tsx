import type { AddDrinkModel } from '@drinkweise/store/drink-session/models/add-drink.model';
import { FlashList } from '@shopify/flash-list';
import React from 'react';

import { AddDrinkListItem } from './AddDrinkListItem';

interface DrinkListProps {
  data: AddDrinkModel[];
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
