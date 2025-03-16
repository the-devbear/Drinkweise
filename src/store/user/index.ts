import { createSlice } from '@reduxjs/toolkit';

import { initialUserState } from './models/user-state.model';
import { userSlice } from './user.slice';

export const userStateSlice = createSlice({
  name: userSlice,
  initialState: initialUserState,
  reducers: {},
});
