export type MenuItem = {
  key: string;
  title: string;
  icon?: string;
  children?: MenuItem[];
  hiddenDefault?: boolean;
  disabled?: boolean;
};

export const menuData: MenuItem[] = [
  { key: 'home', title: '首页', children: [], icon: 'HomeOutlined' },
  {
    key: 'material',
    title: '素材管理',
    icon: 'CommentOutlined',
    children: [
      { key: 'material/overview', title: '概览', children: [] },
      { key: 'template-message/list', title: '模板消息', children: [] },
      { key: 'template-message/edit', title: '编辑素材', children: [] },
    ],
  },
  {
    key: 'task',
    title: '任务管理',
    icon: 'BarsOutlined',
    children: [
      { key: 'task/overview', title: '任务概览', children: [] },
      { key: 'task/list', title: '任务列表', children: [] },
      {
        key: 'task/executor',
        title: '任务执行器',
        children: [],
        hiddenDefault: true,
      },
    ],
  },
  { key: 'settings', title: '设置', children: [], icon: 'SettingOutlined' },
];
export { default as routes } from './routes';
