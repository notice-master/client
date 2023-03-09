import { AxiosRequestConfig } from 'axios';
import { IDBPDatabase } from 'idb';
import { MessageActions, WorkerStatus } from '../constants';

interface ITask {
  taskConfig: TTaskSets;
  defaultRequestConfig: AxiosRequestConfig;
  state: TTaskState;
  initializedStatus: WorkerStatus;
  db: IDBPDatabase | undefined;
}

type TTaskConfig = {
  delay: number;
  taskId: string;
  processId: string;
};

type TTaskState = {
  status: WorkerStatus;
  total: number;
  finished: number;
  pending: number;
  successed: number;
  failed: number;
};

type TTask = {
  id: string;
  index: number;
  action: MessageActions;
};

type TTaskResult<T = any> = {
  response: any;
  status: TaskStatus;
  error?: any;
  task: T;
};

type TTaskStatus = {
  name: WorkerStatus;
  total: number;
  finished: number;
};

type TWorkerMessage = {
  action: MessageActions;
  data: any;
  status?: TTaskStatus | undefined;
};
