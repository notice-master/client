import { createAsyncThunk } from '@reduxjs/toolkit';
import { restApi } from '../services';

export const fetchDictionaries = createAsyncThunk(
  'nls/fetchDictionaries',
  async (scope: string, thunkAPI) => {
    const { getState, rejectWithValue } = thunkAPI;
    const { dictionary }: any = getState();
    if (!scope) {
      return rejectWithValue({ isLoaded: true });
    }
    if (dictionary.loadedModule[scope]) {
      return rejectWithValue({ isLoaded: true });
    }
    const response = await restApi.get(`/assets/translations/${scope}.json`);
    return response.data;
  }
);
