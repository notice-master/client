import { configureStore } from '@reduxjs/toolkit';
import dictionaryReducer from './dictionarySlice';
import globalReducer from './globalSlice';

const defaultReducers = {
  global: globalReducer,
  dictionary: dictionaryReducer,
};

export const getGlobalStore = () => {
  return configureStore({
    reducer: {
      ...defaultReducers,
    },
  });
};
export const store = getGlobalStore();

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
