import axios from 'axios';
import _ from 'lodash';
import { MessageActions, WorkerStatus } from '../constants';
import { getMessage } from '../utils';


class Task implements TaskInterface {
  public taskSets = {
    url: '',
    delay: 500,
    total: 0,
    finished: 0,
  };
  public queue: taskType[] = [];
  public status: WorkerStatus = WorkerStatus.pending;
  public initializedStatus: WorkerStatus = WorkerStatus.uninitialized;
  constructor() {}
  handleMessage(event: MessageEvent) {
    const { data: messageData } = event;
    console.log('messageData: ', messageData);
    switch (messageData.action) {
      case MessageActions.setup:
        const { tasks = [], ...rest }: taskType & { tasks: taskType[] } =
          messageData.data;
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
  getFinalRequest(task: taskType) {
    const mergedTask = _.defaultsDeep(task, this.taskSets);
    return {
      url: mergedTask.url,
      params: mergedTask.search,
      data: mergedTask.params,
      headers: mergedTask.headers,
      method: mergedTask.method,
    };
  }
  execute(config: any, task: taskType) {
    const { type } = task;
    return axios
      .request(config)
      .then((response) => {
        this.conveyResult(response, type);
      })
      .catch((error) => {
        this.conveyResult(error, type);
      });
  }
  conveyResult(result: any, type: string | undefined) {
    switch (type) {
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
console.log('worker: ', worker);
addEventListener('message', function (event) {
  worker.handleMessage(event);
});
