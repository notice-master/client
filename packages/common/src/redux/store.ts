import { configureStore } from '@reduxjs/toolkit';
import { createInjectorsEnhancer } from 'redux-injectors';
import createSagaMiddleware from 'redux-saga';
import { combineReducers } from 'redux';
import dictionaryReducer from './dictionarySlice';
import globalReducer from './globalSlice';
import taskModalReducer from './taskModalSlice';
import { WechatApi } from '../services/WechatApi';

const defaultReducers = {
  global: globalReducer,
  dictionary: dictionaryReducer,
  taskModal: taskModalReducer,
  [WechatApi.reducerPath]: WechatApi.reducer,
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
    enhancers,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat([WechatApi.middleware]);
    },
  });
};
export const store = getGlobalStore();

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
