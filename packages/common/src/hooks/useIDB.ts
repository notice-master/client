import { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useAppDispatch, useAppSelector } from '../redux';
import { fetchDictionaries } from '../redux/thunk';

export const useIDB = (scope?: string) => {
  const locale = useAppSelector((state) => state.dictionary.locale);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (scope) {
      dispatch(fetchDictionaries(scope));
    }
  }, [locale]);
  const intl = useIntl();
  return { intl, locale };
};
