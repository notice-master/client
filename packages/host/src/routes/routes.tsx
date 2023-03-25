import { Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import {
  Framework,
  HomePage,
  TaskEntry,
  MaterialEntry,
  NotFoundPage,
} from '../container';

const routes: RouteObject[] = [
  {
    Component: Framework,
    ErrorBoundary: NotFoundPage,
    children: [
      {
        path: 'home',
        Component: HomePage,
      },
      {
        path: 'task/*',
        Component: TaskEntry,
      },
      // {
      //   path: '/template-message/*',
      //   Component: TemplateMessageEntry,
      // },
      {
        path: 'material/*',
        Component: MaterialEntry,
      },
      // {
      //   path: 'settings',
      //   Component: Settings,
      // },
      {
        path: '/',
        element: <Navigate replace to="home" />,
      },
    ],
  },
];
export default routes;
