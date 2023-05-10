import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as R from 'ramda';

export interface GlobalState {
  appId: string;
  accounts: {
    wechatAppId: string;
  };
}

const initialState: GlobalState = {
  appId: 'test_app_id',
  accounts: {
    wechatAppId: 'test_wechat_app_id',
  },
};

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setGlobalState: (state, action: PayloadAction<GlobalState>) => {
      return R.mergeDeepLeft(action.payload, state);
    },
  },
});

// Action creators are generated for each case reducer function
export const { setGlobalState } = globalSlice.actions;

export default globalSlice.reducer;
