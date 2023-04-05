import { globalStyle, style } from '@vanilla-extract/css';
export const exampleStyle = style({});
globalStyle(`${exampleStyle} .ant-popover-inner .ant-popover-inner-content`, {
  padding: 0,
});
