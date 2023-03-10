import { AxiosRequestConfig } from 'axios';
import { IDBPDatabase } from 'idb';
import { MessageActions, WorkerStatus } from '../constants';

interface ITaskWorker {
  config: TTaskConfig;
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

type TTaskResult<T = any> = {
  response: any;
  status: TaskStatus;
  error?: any;
  task: T;
};

type TWorkerMessage = {
  action: MessageActions;
  data: any;
  state?: TTaskState | undefined;
  config?: TTaskConfig | undefined;
};
