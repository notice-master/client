import { TTaskState } from './worker';

type MenuItem = {
  key: string;
  title: string;
  icon?: string;
  children?: MenuItem[];
};

interface IconsTypes {
  [key: string]: ReactNode;
}

type postParamsType = {
  [key: string]: string | postParamsType;
};

interface IProcessInterface {
  worker: Worker;
  state: TTaskState;
  run: () => void;
  pause: () => void;
}
