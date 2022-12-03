// const path = require('path');
type MessageType = {
  action: string | number;
  data: any;
  status?: {
    name: string;
    total: number;
    finished: number;
  };
};
export const getMessage = (
  action: string | number,
  data?: any | undefined,
  taskObj?: any | undefined
) => {
  const result: MessageType = {
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
  const content = `importScripts("${_path}");`;
  return URL.createObjectURL(new Blob([content], { type: 'text/javascript' }));
};
