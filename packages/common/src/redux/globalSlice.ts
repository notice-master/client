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
    setCurrentPageInfo: (state, action: PayloadAction<CurrentPageInfo>) => {
      state.currentPageInfo = {
        ...state.currentPageInfo,
        ...action.payload,
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCurrentPageInfo } = globalSlice.actions;

export default globalSlice.reducer;
