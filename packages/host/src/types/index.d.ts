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

type taskType = {
  url?: string;
  search?: {
    [key: string]: string;
  };
  params?: postParamsType;
  type?: string;
  method?: string;
  headers?: {
    [key: string]: string;
  };
};
type taskSetsType = taskType & {
  url: string;
  delay: number;
};
interface TaskInterface {
  taskSets: taskSetsType;
  queue: taskType[];
  handleMessage: (event: MessageEvent) => any;
}
interface TaskHelperInterface {
  worker: Worker;
  status: string;
  // push: (tasks: taskType[]) => void;
  run: () => void;
  pause: () => void;
}
