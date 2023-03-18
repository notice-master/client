import { getTaskDBInstance } from './idb';
import { IDBPDatabase } from 'idb';

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
