import { IDBPDatabase, deleteDB } from 'idb';
import { getTaskDBInstance, getTaskManageDBInstance } from './idb';
import {
  INDEXED_DB_PREFIX,
  TASK_MANAGE_DB_NAME,
  TASK_MANAGE_DB_VERSION,
  TASK_STATE_DB_VERSION,
  PROCESS_STORE_PREFIX,
  PROCESS_STATUS_STORE_NAME,
  TASK_STATE_DB_NAME,
} from '../constants';

export const initTask = async (
  taskId: string | number,
  threadCounts: number
): Promise<{ db: IDBPDatabase; workerPool: WorkerPoolType }> => {
  const workerPool: WorkerPoolType = {};
  new Array(threadCounts).fill('').forEach((val, index) => {
    const key = Math.random().toString(32).substring(3);
    workerPool[key] = { key };
  });
  const db = await getTaskDBInstance(taskId, threadCounts);
  return {
    db,
    workerPool,
  };
};

export const deleteTask = async (taskId: string, index: number) => {
  if (taskId && index) {
    const db = await getTaskManageDBInstance();
    db.transaction('tasks', 'readwrite').store.delete(index);
    deleteDB(`${INDEXED_DB_PREFIX}${TASK_STATE_DB_NAME}${taskId}`, {
      blocked: (version) => {
        console.log('🚀 ~ delete version:', version);
      },
    });
  }
};
