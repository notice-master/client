import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { createInjectorsEnhancer } from 'redux-injectors';
import createSagaMiddleware from 'redux-saga';
import dictionaryReducer from './dictionarySlice';
import globalReducer from './globalSlice';

const defaultReducers = {
  global: globalReducer,
  dictionary: dictionaryReducer,
};
const sagaMiddleware = createSagaMiddleware();
const runSaga = sagaMiddleware.run;
function createReducer(injectedReducers = {}) {
  const rootReducer = combineReducers({
    ...injectedReducers,
    // other non-injected reducers can go here...
    ...defaultReducers,
  });
  return rootReducer;
}
const enhancers = [createInjectorsEnhancer({ createReducer, runSaga })];

export const getGlobalStore = () => {
  return configureStore({
    reducer: {
      ...defaultReducers,
    },
    enhancers: enhancers,
  });
};
export const store = getGlobalStore();

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
