import { HomePage, TaskEntry } from '../container';
interface RouteInterface {
  path: string;
  component: JSX.Element;
  title?: string;
  subTitle?: string;
}
// const TemplateMessageEntry = React.lazy(
//   () => import('@nmc/template-message/entry')
// );
// const TaskEntry = React.lazy(() => import('@nmc/common/containers/TaskEntry'));
// const Settings = React.lazy(() => import('@nmc/common/containers/Settings'));
// const Home = React.lazy(() => import('@nmc/common/containers/Home'));

const routes: RouteInterface[] = [
  {
    path: '/home',
    component: <HomePage />,
  },
  // {
  //   path: '/template-message/*',
  //   component: <TemplateMessageEntry />,
  // },
  {
    path: '/task/*',
    component: <TaskEntry />,
  },
  // {
  //   path: 'settings',
  //   component: <Settings />,
  // },
];
export default routes;
