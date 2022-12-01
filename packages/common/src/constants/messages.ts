import { defineMessages, MessageDescriptor } from 'react-intl';
export interface messageMap {
  [key: string]: MessageDescriptor;
}
const scope = 'global';
const globalMessages: messageMap = defineMessages({
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
  unknow: {
    id: `${scope}.unknow`,
    description: 'Message to overview of the Navigator.',
    defaultMessage: '未知',
  },
});
export default globalMessages;
