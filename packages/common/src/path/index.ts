export const rootPath = '/';
export const getPathByKey = (key: string): string => {
  return `${rootPath}${key}`;
};
export const getKeyByPath = (path: string): string => {
  return path.replace(rootPath, '');
};
