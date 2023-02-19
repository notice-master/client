import { AxiosRequestConfig } from "axios";
import { MessageActions, WorkerStatus } from '../constants';

type TTaskSets = {
  url: string;
  delay: number;
  total: number;
  finished: number;
}

type TTask = AxiosRequestConfig & {
  action: MessageActions
}

type TTaskStatus = {
  name: WorkerStatus;
  total: number;
  finished: number;
}

type TWorkerMessage = {
  action: MessageActions,
  data: any,
  status?: TTaskStatus | undefined;
}
