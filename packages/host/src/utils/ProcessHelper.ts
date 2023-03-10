import { TTaskState } from 'src/types/worker';
import { MessageActions, WorkerStatus } from '../constants';
import { getMessage } from './WorkerHelper';
import { IProcessInterface } from '../types';

export class ProcessHelper implements IProcessInterface {
  public worker;
  public state: TTaskState;
  constructor(worker: Worker, state: TTaskState) {
    this.worker = worker;
    this.state = state;
  }
  pause() {
    this.worker.postMessage(getMessage(MessageActions.pause));
  }
  run() {
    this.worker.postMessage(getMessage(MessageActions.run));
  }
  // setUp(taskSets: taskSetsType) {
  //   this.worker.postMessage(getMessage(MessageActions.setup, taskSets));
  // }
}
