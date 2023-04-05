import { style } from '@vanilla-extract/css';
export const TemplatePreviewBox = style({
  width: '100%',
  verticalAlign: 'top',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
});
export const withBorder = style({
  boxShadow:
    '0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12)',
  borderRadius: '4px',
});
export const TemplatePreviewContent = style({
  selectors: {
    [`${TemplatePreviewBox} &`]: {
      overflowY: 'scroll',
      flexGrow: 1,
    },
  },
});
