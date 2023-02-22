import { ITask, TWorkerMessage } from "src/types/worker";
import { MessageActions } from '../constants';

export const getMessage = (action: MessageActions, data?: any, taskObj?: ITask): TWorkerMessage => {
  const result: TWorkerMessage = {
    action,
    data,
  };
  if (taskObj) {
    const status = {
      name: taskObj?.status,
      total: taskObj?.taskSets.total,
      finished: taskObj?.taskSets.finished,
    };
    result.status = status;
  }
  return result;
};

export const getRemoteWorker = (_path: any) => {
  if(true) {
    return '/static/js/worker/task.worker.js';
  } else {
    return URL.createObjectURL(new Blob([`importScripts("${_path}");`], { type: 'text/javascript' }));
  }
};
