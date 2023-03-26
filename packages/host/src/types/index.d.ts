/// <reference types="react" />
/// <reference path="worker.d.ts" />

interface IconsTypes {
  [key: string]: React.ReactNode;
}

interface IProcessInterface {
  worker: Worker;
  state: TTaskState;
  run: () => void;
  pause: () => void;
}
