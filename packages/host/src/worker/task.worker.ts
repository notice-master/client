/**
 * @version 1.0.0
 * @Author Kylong
 */
import axios, { AxiosRequestConfig } from 'axios';
import * as R from 'ramda';
import { MessageActions, WorkerStatus, TaskStatus } from '../constants';
import {
  PROCESS_STORE_PREFIX,
  PROCESS_STATUS_STORE_NAME,
  getTaskDBInstance,
} from '@nmc/idb';
import type { IDBPDatabase } from '@nmc/idb';
import { getMessage } from '../utils';

class TaskWorker implements ITaskWorker {
  public config: TTaskConfig;
  public defaultRequestConfig: AxiosRequestConfig;
  public state: TTaskState;
  public initializedStatus: WorkerStatus;
  public db: IDBPDatabase | undefined;

  constructor() {
    this.config = {
      delay: 500,
      taskId: '',
      processId: '',
    };
    this.defaultRequestConfig = {};
    this.state = {
      status: WorkerStatus.pending,
      total: 0,
      finished: 0,
      pending: 0,
      successed: 0,
      failed: 0,
    };
    this.initializedStatus = WorkerStatus.uninitialized;
    this.db = undefined;
  }
  get storeName() {
    return `${PROCESS_STORE_PREFIX}${this.config.processId}`;
  }
  handleMessage(event: Event & { data?: any }) {
    const { data: messageData } = event;
    console.log('messageData: ', messageData);
    switch (messageData.action) {
      case MessageActions.setup:
        const {
          tasks = [],
          defaultRequestConfig = {},
          config = {},
          ...rest
        } = messageData.data;
        this.defaultRequestConfig = R.mergeDeepLeft(
          defaultRequestConfig,
          this.defaultRequestConfig
        );
        this.config = R.mergeDeepLeft(config, this.config);
        this.state.total = Math.max(this.state.total, config.total);
        // first setup
        if (this.initializedStatus === WorkerStatus.uninitialized) {
          this.initializedStatus = WorkerStatus.initialized;
          getTaskDBInstance(this.config.taskId).then(async (_db) => {
            this.db = _db;
          });
          const readyMessage = getMessage(
            MessageActions.ready,
            { ...this.config },
            this
          );
          postMessage(readyMessage);
        }
        break;
      case MessageActions.run:
        if (
          this.initializedStatus === WorkerStatus.initialized &&
          [WorkerStatus.paused, WorkerStatus.pending].includes(
            this.state.status
          )
        ) {
          this.state.status = WorkerStatus.running;
          this.run();
        }
        break;
      case MessageActions.pause:
        if (this.state.status === WorkerStatus.running) {
          this.state.status = WorkerStatus.paused;
        }
        break;
    }
    this.updateStatus();
  }

  async run() {
    if (this.state.status === WorkerStatus.running) {
      setTimeout(async () => {
        this?.db
          ?.transaction(this.storeName, 'readonly')
          .store.index('status')
          .get(IDBKeyRange.only(TaskStatus.pending))
          .then(async (task) => {
            if (task && (!task.status || task.status === TaskStatus.pending)) {
              const result: TTaskResult = {
                response: null,
                status: TaskStatus.pending,
                error: undefined,
                task: task,
              };
              try {
                const { data } = await this.execute(
                  this.getFinalRequest(task.config)
                );
                // TODO: allow custom check logic
                const { errcode } = data;
                if (errcode) {
                  throw data;
                } else {
                  result.response = data;
                  result.status = TaskStatus.successed;
                }
              } catch (err) {
                result.error = err;
                result.status = TaskStatus.failed;
              }

              this.updateStatus(result);
            }
          });
        this.run();
      }, this.config.delay);
    }
  }
  getFinalRequest(task: AxiosRequestConfig) {
    const mergedTask = R.mergeDeepLeft(task, this.defaultRequestConfig);
    return {
      url: mergedTask.url,
      params: mergedTask.params,
      data: mergedTask.data,
      headers: mergedTask.headers,
      method: mergedTask.method,
    };
  }
  execute(config: AxiosRequestConfig) {
    return axios
      .request(config)
      .then((response) => response)
      .catch((error) => error);
  }
  async updateStatus(result?: TTaskResult) {
    if (this.db) {
      if (result) {
        const { task, ...rest } = result;
        await this.db.put(this.storeName, { ...task, ...rest });
      }
      const tx = this.db?.transaction(this.storeName);
      const total = Math.max(this.state.total, await tx.store.count());
      const pending = await tx.store.index('status').count(TaskStatus.pending);
      const failed = await tx.store.index('status').count(TaskStatus.failed);
      const successed = await tx.store
        .index('status')
        .count(TaskStatus.successed);
      this.state = R.mergeDeepLeft(
        { total, pending, failed, successed, finished: failed + successed },
        this.state
      );
      await this.db.put(PROCESS_STATUS_STORE_NAME, {
        process_id: this.config.processId,
        state: this.state,
      });
    }
    const updatedMessage = getMessage(
      MessageActions.updated,
      {
        result: result && JSON.parse(JSON.stringify(result)), // Only transferable objects can be transferred.
      },
      this
    );
    postMessage(updatedMessage);
  }
}
const worker = new TaskWorker();
console.log('worker with js version: ', worker);
addEventListener('message', function (event) {
  worker.handleMessage(event);
});
