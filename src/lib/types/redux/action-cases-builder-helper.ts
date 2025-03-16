import type { ActionReducerMapBuilder } from '@reduxjs/toolkit';

export type ActionCasesBuilderHelper<T extends object> = (
  builder: ActionReducerMapBuilder<T>
) => ActionReducerMapBuilder<T>;
