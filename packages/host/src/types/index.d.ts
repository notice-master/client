/// <reference types="react" />
/// <reference path="worker.d.ts" />

type MenuItem = {
  key: string;
  title: string;
  icon?: axios.AxiosRequestConfig;
  children?: MenuItem[];
};

interface IconsTypes {
  [key: string]: React.ReactNode;
}

interface IProcessInterface {
  worker: Worker;
  state: TTaskState;
  run: () => void;
  pause: () => void;
}
