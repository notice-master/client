import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { GqlProvider, LanguageProvider, store } from '..';
export interface CustomMessage {
  [key: string]: string;
}
const CommonProviders = ({ children }: { children: JSX.Element }) => {
  return (
    <Provider store={store}>
      <LanguageProvider>
        <GqlProvider>
          <BrowserRouter>{children}</BrowserRouter>
        </GqlProvider>
      </LanguageProvider>
    </Provider>
  );
};

export default CommonProviders;
