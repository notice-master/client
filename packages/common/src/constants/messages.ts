import { defineMessages, MessageDescriptor } from 'react-intl';
export interface messageMap {
  [key: string]: MessageDescriptor;
}
const scope = 'global';
export const globalMessages: messageMap = defineMessages({
  unknow: {
    id: `${scope}.unknow`,
    description: 'Message to overview of the Navigator.',
    defaultMessage: '未知',
  },
});
