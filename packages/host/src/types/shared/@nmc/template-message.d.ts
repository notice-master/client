declare module '@nmc/template-message/bootstrap' {
export {};
}
declare module '@nmc/template-message/entry' {
 const Entry: () => JSX.Element;
export default Entry;
}
declare module '@nmc/template-message' {
}
declare module '@nmc/template-message/configs' {
 const _default: {
    riskHost: string;
};
export default _default;
}
declare module '@nmc/template-message/containers' {
export { default as TemplateMessageOverview } from '@nmc/template-message/containers/overview';
}
declare module '@nmc/template-message/containers/overview' {
 const TemplateMessageOverview: () => JSX.Element;
export default TemplateMessageOverview;
}
