import { ITaskWorker, TWorkerMessage } from 'src/types/worker';
import { MessageActions } from '../constants';

export const getMessage = (
  action: MessageActions,
  data?: any,
  taskObj?: ITaskWorker
): TWorkerMessage => {
  const result: TWorkerMessage = {
    action,
    data,
  };
  if (taskObj) {
    result.state = taskObj?.state;
    result.config = taskObj?.config;
  }
  return result;
};

export const getRemoteWorker = (_path: any) => {
  if (true) {
    return '/static/js/worker/task.worker.js';
  } else {
    return URL.createObjectURL(
      new Blob([`importScripts("${_path}");`], { type: 'text/javascript' })
    );
  }
};
