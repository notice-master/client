import {
  IDBPDatabase,
  deleteDB,
  getTaskDBInstance,
  getManageDBInstance,
  INDEXED_DB_PREFIX,
  TASK_STATE_DB_NAME,
} from '@nmc/idb';

export const initTask = async (
  taskId: string | number,
  threadCounts: number
): Promise<{ db: IDBPDatabase; workerPool: WorkerPoolType }> => {
  const workerPool: WorkerPoolType = {};
  new Array(Number(threadCounts)).fill('').forEach((val, index) => {
    const key = Math.random().toString(32).substring(3);
    workerPool[key] = { key };
  });
  const db = await getTaskDBInstance(taskId, threadCounts);
  return {
    db,
    workerPool,
  };
};

export const deleteTask = async (
  appId: string,
  taskId: string,
  index: number
) => {
  if (taskId && index) {
    const db = await getManageDBInstance(appId);
    if (db) {
      db.transaction('tasks', 'readwrite').store.delete(index);
      deleteDB(`${INDEXED_DB_PREFIX}${TASK_STATE_DB_NAME}${taskId}`, {
        blocked: (version) => {
          console.log('🚀 ~ delete version:', version);
        },
      });
    }
  }
};
