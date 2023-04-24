import {
  Navigate,
  Form,
  useActionData,
  BrowserRouter,
  Outlet,
} from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { Alert } from 'antd';
import {
  Framework,
  HomePage,
  TaskEntry,
  MaterialEntry,
  NotFoundPage,
} from '../container';
import TaskExecutor from 'src/container/task/TaskExecutor';
import React from 'react';
// const TemplateMessageApp = React.lazy(() => import('@templateMessage/App'));
import TemplateMessageApp from '../../../template-message/src/App';
const { ErrorBoundary } = Alert;
const routes: RouteObject[] = [
  {
    Component: Framework,
    ErrorBoundary: NotFoundPage, // TODO: handle more http status not only 404
    children: [
      {
        path: 'home',
        Component: HomePage,
      },
      {
        path: 'task/executor',
        Component: TaskExecutor,
        action: async ({ request, params }) => {
          switch (request.method) {
            case 'POST': {
              const formData = await request.formData();
              return {
                taskId: formData.get('taskId'),
              };
            }
            default: {
              throw new Response('', { status: 405 });
            }
          }
        },
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
      {
        path: 'template-message/*',
        // Component: TemplateMessageApp,
        element: (
          <React.Suspense fallback="loading...">
            <ErrorBoundary message={'加载内容失败'} description="">
              <TemplateMessageApp />
            </ErrorBoundary>
          </React.Suspense>
        ),
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
