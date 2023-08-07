import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useAppDispatch, useAppSelector } from '../redux';
import { fetchDictionaries } from '../redux/thunk';
import { getManageDBInstance } from '@nmc/idb';
import type { OpenDBCallbacks, IDBPDatabase } from '@nmc/idb';

export const useManageDBInstance = (
  appId: string,
  version?: number | undefined,
  _upgrade?: OpenDBCallbacks<unknown>['upgrade']
) => {
  const [db, setDb] = useState<IDBPDatabase>();
  const initDB = async () => {
    const _db = await getManageDBInstance(appId, version, _upgrade);
    _db && setDb(_db);
  };
  useEffect(() => {
    initDB();
    return () => {
      db?.close();
    };
  }, []);
  useEffect(() => {
    if (version && db?.version && version > db.version) {
      db.close();
      initDB();
    }
  }, [version, db?.version]);
  return { db };
};

// export const useTaskDBInstance = (scope?: string) => {};
