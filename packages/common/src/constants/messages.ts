import { defineMessages, MessageDescriptor } from 'react-intl';
export interface messageMap {
  [key: string]: MessageDescriptor;
}
const scope = 'global';
export const globalMessages: messageMap = defineMessages({
  home: {
    id: `${scope}.home`,
    description: 'Message to Home of the Navigator.',
    defaultMessage: '首页',
  },
  ['template-message']: {
    id: `${scope}.template-message`,
    description: 'Message to template-message of the Navigator.',
    defaultMessage: '模板消息',
  },
  material: {
    id: `${scope}.material`,
    description: 'Message to overview of the Navigator.',
    defaultMessage: '素材',
  },
  overview: {
    id: `${scope}.overview`,
    description: 'Message to overview of the Navigator.',
    defaultMessage: '概览',
  },
  edit: {
    id: `${scope}.edit`,
    description: 'Message to edit of the Navigator.',
    defaultMessage: '编辑',
  },
  list: {
    id: `${scope}.list`,
    description: 'Message to list of the Navigator.',
    defaultMessage: '列表',
  },
  task: {
    id: `${scope}.task`,
    description: 'Message to list of the Navigator.',
    defaultMessage: '任务',
  },
  executor: {
    id: `${scope}.executor`,
    description: 'Task executor',
    defaultMessage: '执行器',
  },
  unknow: {
    id: `${scope}.unknow`,
    description: 'Message to overview of the Navigator.',
    defaultMessage: '未知',
  },
});
