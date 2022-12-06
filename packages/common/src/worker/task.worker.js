/**
 * @version 1.0.0
 * @Author Kylong
 */
importScripts(
  'https://cdn.bootcdn.net/ajax/libs/axios/0.25.0/axios.min.js',
  'https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.min.js'
);
const MessageActions = {
  setup: 'setup',
  run: 'run',
  pause: 'pause',
  // from worker to main thread
  ready: 'ready',
  updated: 'updated',
  convey: 'convey',
  response: 'response',
};
const WorkerStatus = {
  uninitialized: 'uninitialized',
  initialized: 'initialized',
  pending: 'pending',
  running: 'running',
  paused: 'paused',
};
const getMessage = (action, data, taskObj) => {
  const result = {
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

// importScripts(new URL('../constants', import.meta.url).toString());

class Task {
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
  handleMessage(event) {
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
  getFinalRequest(task) {
    const mergedTask = _.defaultsDeep(task, this.taskSets);
    return {
      url: mergedTask.url,
      params: mergedTask.search,
      data: mergedTask.params,
      headers: mergedTask.headers,
      method: mergedTask.method,
    };
  }
  execute(config, task) {
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
  conveyResult(result, type) {
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
console.log('worker with js version: ', worker);
addEventListener('message', function (event) {
  worker.handleMessage(event);
});
