declare module '@nmc/navigation/bootstrap' {
export {};
}
declare module '@nmc/navigation' {
}
declare module '@nmc/navigation/components/BreadcrumbContent' {
/// <reference types="react" />
 const BreadcrumbContent: () => JSX.Element;
export default BreadcrumbContent;
}
declare module '@nmc/navigation/components/LeftMenu' {
/// <reference types="react" />
import 'antd/dist/antd.min.css';
import '../styled/common.scss';
 const LeftMenu: () => JSX.Element;
export default LeftMenu;
}
declare module '@nmc/navigation/constants' {
export  const menuData: MenuItem[];
export { default as routes } from '@nmc/navigation/constants/routes';
}
declare module '@nmc/navigation/constants/routes' {
/// <reference types="react" />
interface RouteInterface {
    path: string;
    component: JSX.Element;
}
 const routes: RouteInterface[];
export default routes;
}
declare module '@nmc/navigation/container/MainRouters' {
import React from 'react';
interface MainRoutersProps {
    wrapper?: React.FunctionComponent;
}
 const MainRouters: ({ wrapper }: MainRoutersProps) => JSX.Element;
export default MainRouters;
}
declare module '@nmc/navigation/container/NotFoundPage' {
/// <reference types="react" />
 const NotFoundPage: () => JSX.Element;
export default NotFoundPage;
}
declare module '@nmc/navigation/container' {
export { default as MainRouters } from '@nmc/navigation/container/MainRouters';
export { default as NotFoundPage } from '@nmc/navigation/container/NotFoundPage';
}
