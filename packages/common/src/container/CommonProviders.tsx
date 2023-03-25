import React from 'react';
import { Provider } from 'react-redux';
import { GqlProvider, LanguageProvider, store } from '..';
export interface CustomMessage {
  [key: string]: string;
}
const CommonProviders = ({ children }: { children: JSX.Element }) => {
  return (
    <Provider store={store}>
      <LanguageProvider>
        <GqlProvider>{children}</GqlProvider>
      </LanguageProvider>
    </Provider>
  );
};

export default CommonProviders;
