import { openDB, IDBPDatabase } from 'idb';
import {
  INDEXED_DB_PREFIX,
  TASK_MANAGE_DB_NAME,
  TASK_MANAGE_DB_VERSION,
  TASK_STATE_DB_VERSION,
  PROCESS_STORE_PREFIX,
  PROCESS_STATUS_STORE_NAME,
  TASK_STATE_DB_NAME,
} from '../constants';

export const getTaskManageDBInstance = () => {
  return openDB(
    `${INDEXED_DB_PREFIX}${TASK_MANAGE_DB_NAME}`,
    TASK_MANAGE_DB_VERSION,
    {
      upgrade(db, oldVersion, newVersion, transaction, event) {
        const store = db.createObjectStore('tasks', {
          keyPath: 'index',
          autoIncrement: true,
        });
        store.createIndex('id', 'id');
        store.createIndex('createTime', 'createTime');
        store.createIndex('updateTime', 'updateTime');
      },
      blocked(currentVersion, blockedVersion, event) {},
      blocking(currentVersion, blockedVersion, event) {},
      terminated() {},
    }
  );
};

export const getTaskDBInstance = (
  taskId: string | number,
  processCount?: number
) => {
  return openDB(
    `${INDEXED_DB_PREFIX}${TASK_STATE_DB_NAME}${taskId}`,
    TASK_STATE_DB_VERSION,
    {
      upgrade(db, oldVersion, newVersion, transaction, event) {
        if (processCount) {
          new Array(processCount).fill('').forEach((val, index) => {
            const processStoreName = `${PROCESS_STORE_PREFIX}${index + 1}`;
            if (!db.objectStoreNames.contains(processStoreName)) {
              const store = db.createObjectStore(processStoreName, {
                keyPath: 'index',
                autoIncrement: true,
              });
              store.createIndex('id', 'id');
              store.createIndex('status', 'status');
            }
          });
          if (!db.objectStoreNames.contains('task_status')) {
            db.createObjectStore(PROCESS_STATUS_STORE_NAME, {
              keyPath: 'process_id',
            });
          }
        }
      },
      blocked(currentVersion, blockedVersion, event) {},
      blocking(currentVersion, blockedVersion, event) {},
      terminated() {},
    }
  );
};
