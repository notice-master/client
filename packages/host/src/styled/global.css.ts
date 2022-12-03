import { globalStyle, style } from '@vanilla-extract/css';
export const exampleStyle = style({});
globalStyle(`body`, {
  margin: 0,
});
globalStyle(`.site-layout .site-layout-background`, {
  background: '#fff'
});
// .site-layout .site-layout-background {
//   background: #fff;
// }