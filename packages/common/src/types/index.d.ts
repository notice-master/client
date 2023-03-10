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
