import { openDB, IDBPDatabase } from 'idb';
import {
  INDEXED_DB_PREFIX,
  MANAGE_DB_NAME,
  MANAGE_DB_VERSION,
  TASK_STATE_DB_VERSION,
  PROCESS_STORE_PREFIX,
  PROCESS_STATUS_STORE_NAME,
  TASK_STATE_DB_NAME,
} from '../constants';

export const getManageDBInstance = (appId: string) => {
  if (!appId) return null;
  return openDB(
    `${INDEXED_DB_PREFIX}${MANAGE_DB_NAME}_${appId}`,
    MANAGE_DB_VERSION,
    {
      upgrade(db, oldVersion, newVersion, transaction, event) {
        // TODO: add generate db function
        if (!db.objectStoreNames.contains('tasks')) {
          const tasksStore = db.createObjectStore('tasks', {
            keyPath: 'index',
            autoIncrement: true,
          });
          tasksStore.createIndex('id', 'id');
          tasksStore.createIndex('createTime', 'createTime');
          tasksStore.createIndex('updateTime', 'updateTime');
        }

        if (!db.objectStoreNames.contains('materials')) {
          const materialStore = db.createObjectStore('materials', {
            keyPath: 'index',
            autoIncrement: true,
          });
          materialStore.createIndex('id', 'id');
          materialStore.createIndex('type', 'type');
          materialStore.createIndex('createTime', 'createTime');
          materialStore.createIndex('updateTime', 'updateTime');
        }
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
