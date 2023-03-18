import { MessageActions, WorkerStatus } from '../constants';
import { getMessage } from './WorkerHelper';

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
}
