import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CurrentPageInfo {
  title: string;
  subtitle: string;
}
export interface GlobalState {
  currentPageInfo: CurrentPageInfo;
}

const initialState: GlobalState = {
  currentPageInfo: { title: 'Title', subtitle: 'This is a subtitle' },
};

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setGlobalState: (state, action: PayloadAction<GlobalState>) => {
      for (const _key in action.payload) {
        const key = _key as keyof GlobalState;
        state[key] = action.payload[key];
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { setGlobalState } = globalSlice.actions;

export default globalSlice.reducer;
