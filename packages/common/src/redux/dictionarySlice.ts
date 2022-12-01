import { createSlice } from '@reduxjs/toolkit';
import { fetchDictionaries } from './thunk';

interface AllMessages {
  [key: string]: { [key: string]: string };
}
export const messages = {} as AllMessages;
const dictionarySlice = createSlice({
  name: 'dictionary',
  initialState: {
    locale: window.navigator.language ?? 'zh-CN',
    // messages: {} as AllMessages,
    loadedModule: {} as any,
    loading: false,
  },
  reducers: {
    // standard reducer logic, with auto-generated action types per reducer
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDictionaries.pending, (state, action) => {
      // const {
      //   meta: { arg: mooduleName },
      // } = action;
      // if (!state.loadedModule[mooduleName]) {
      //   state.loadedModule[mooduleName] = false;
      // }
      // Add user to the state array
    });
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchDictionaries.fulfilled, (state, action) => {
      const {
        meta: { arg: mooduleName },
        payload,
      } = action;
      for (const local in payload) {
        if (!messages[local]) {
          messages[local] = {};
        }
        for (const key in payload[local]) {
          messages[local][`${mooduleName}.${key}`] = payload[local][key];
        }
        // if (!state.messages[local]) {
        //   state.messages[local] = {};
        // }
        // for (const key in payload[local]) {
        //   state.messages[local][`${mooduleName}.${key}`] = payload[local][key];
        // }
      }
      state.loadedModule[mooduleName] = true;
      // Add user to the state array
      // state.loading = false;
    });
    builder.addCase(fetchDictionaries.rejected, (state, action) => {
      const {
        meta: { arg: mooduleName },
        payload,
      } = action;
      if (!payload) return;
      const { isLoaded }: any = payload;
      if (!isLoaded) {
        state.loadedModule[mooduleName] = false;
      }
      // Add user to the state array
      // state.loading = false;
    });
  },
});

export default dictionarySlice.reducer;
