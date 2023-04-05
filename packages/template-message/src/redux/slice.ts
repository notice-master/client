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

export const tplSlice = createSlice({
  name: 'template-messagetest',
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
export const { setCurrentPageInfo } = tplSlice.actions;

export default tplSlice.reducer;
