import { useCallback, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useAppDispatch, useAppSelector } from '../redux';
import { fetchDictionaries } from '../redux/thunk';

export const useNLS = (scope?: string) => {
  const locale = useAppSelector((state) => state.dictionary.locale);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (scope) {
      dispatch(fetchDictionaries(scope));
    }
  }, [locale]);
  const intl = useIntl();
  const nls = useCallback(
    (key: string, options?: Record<string, any>) => {
      return intl.formatMessage(
        {
          id: `${scope}.${key}`,
          defaultMessage: `${scope}.${key}`,
        },
        options
      );
    },
    [intl]
  );
  return { intl, locale, nls };
};
