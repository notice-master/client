declare namespace Axios {
  type AxiosRequestConfig = import('axios').AxiosRequestConfig;
}
declare namespace Constants {
  type WorkerStatus = import('../constants').WorkerStatus;
  type TaskStatus = import('../constants').TaskStatus;
  type MessageActions = import('../constants').MessageActions;
}
interface ITaskWorker {
  config: TTaskConfig;
  defaultRequestConfig: Axios.AxiosRequestConfig;
  state: TTaskState;
  initializedStatus: Constants.WorkerStatus;
  db: import('idb').IDBPDatabase | undefined;
}

type TTaskConfig = {
  delay: number;
  taskId: string;
  processId: string;
};

type TTaskState = {
  status: Constants.WorkerStatus;
  total: number;
  finished: number;
  pending: number;
  successed: number;
  failed: number;
};

type TTaskResult<T = any> = {
  response: any;
  status: Constants.TaskStatus;
  error?: any;
  task: T;
};

type TWorkerMessage = {
  action: Constants.MessageActions;
  data: any;
  state?: TTaskState | undefined;
  config?: TTaskConfig | undefined;
};

type WorkerPoolType = {
  [key: string]: {
    key: string;
    processHelper?: import('../utils').ProcessHelper;
  };
};
