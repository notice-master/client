/**
 * @version 1.0.0
 * @Author Kylong
 */
import axios, { AxiosRequestConfig } from "axios";
import * as R from 'ramda';
import { TTask, TTaskSets, TWorkerMessage } from "src/types/worker";
import { MessageActions, WorkerStatus } from '../constants';

const getMessage = (action: MessageActions, data: any, taskObj: Task): TWorkerMessage => {
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

class Task {
  public taskSets: TTaskSets;
  public queue: TTask[];
  public status: WorkerStatus;
  public initializedStatus: WorkerStatus;
  constructor() {
    this.taskSets = {
      url: '',
      delay: 500,
      total: 0,
      finished: 0,
    };
    this.queue = [];
    this.status = WorkerStatus.pending;
    this.initializedStatus = WorkerStatus.uninitialized;
  }
  handleMessage(event: Event & { data?: any}) {
    const { data: messageData } = event;
    console.log('messageData: ', messageData);
    switch (messageData.action) {
      case MessageActions.setup:
        const { tasks = [], ...rest } = messageData.data;
        this.taskSets = {
          ...this.taskSets,
          ...rest,
        };
        // first setup
        if (this.initializedStatus === WorkerStatus.uninitialized) {
          this.initializedStatus = WorkerStatus.initialized;
          const readyMessage = getMessage(
            MessageActions.ready,
            { ...this.taskSets },
            this
          );
          postMessage(readyMessage);
        }

        if (tasks.length) {
          this.queue.push(...tasks);
        }
        break;
      case MessageActions.run:
        if (
          this.initializedStatus === WorkerStatus.initialized &&
          [WorkerStatus.paused, WorkerStatus.pending].includes(this.status)
        ) {
          this.status = WorkerStatus.running;
          this.run();
        }
        break;
      case MessageActions.pause:
        if (this.status === WorkerStatus.running) {
          this.status = WorkerStatus.paused;
        }
        break;
    }
    this.updateStatus();
  }
  updateStatus() {
    const updatedMessage = getMessage(
      MessageActions.updated,
      {
        taskSets: this.taskSets,
        taskCounts: this.queue.length,
      },
      this
    );
    postMessage(updatedMessage);
  }
  run() {
    if (this.status === WorkerStatus.running) {
      setTimeout(async () => {
        const task = this.queue.shift();
        if (task) {
          try {
            await this.execute(this.getFinalRequest(task), task);
          } catch (err) {
            console.log('err: ', err);
          }
        }
        this.run();
      }, this.taskSets.delay);
    }
  }
  getFinalRequest(task: TTask) {
    const mergedTask = R.mergeDeepLeft(task, this.taskSets);
    return {
      url: mergedTask.url,
      params: mergedTask.params,
      data: mergedTask.data,
      headers: mergedTask.headers,
      method: mergedTask.method,
    };
  }
  execute(config: AxiosRequestConfig, task: TTask) {
    const { action } = task;
    return axios
      .request(config)
      .then((response) => {
        this.conveyResult(response, action);
      })
      .catch((error) => {
        this.conveyResult(error, action);
      });
  }
  conveyResult(result: any, action: MessageActions) {
    switch (action) {
      case MessageActions.response:
        break;
      default:
        this.taskSets.finished++;
    }

    const updatedMessage = getMessage(
      MessageActions.convey,
      JSON.parse(JSON.stringify(result)), // Only transferable objects can be transferred.
      this
    );

    postMessage(updatedMessage);
  }
}
const worker = new Task();
console.log('worker with js version: ', worker);
addEventListener('message', function (event) {
  worker.handleMessage(event);
});
