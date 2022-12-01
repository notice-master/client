import React from 'react';
import { IntlProvider } from 'react-intl';
import { useAppSelector } from '..';
import { messages } from '../redux/dictionarySlice';

export const LanguageProvider = ({ children }: { children: JSX.Element }) => {
  // const { locale, messages } = useAppSelector((state) => state.dictionary);
  const { locale } = useAppSelector((state) => state.dictionary);
  return (
    <IntlProvider
      locale={locale}
      messages={messages[locale]}
      onError={() => {}}
    >
      {React.Children.only(children)}
    </IntlProvider>
  );
};
