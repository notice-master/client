import { Navigate, Form, useActionData } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import {
  Framework,
  HomePage,
  TaskEntry,
  MaterialEntry,
  NotFoundPage,
} from '../container';
import TaskExecutor from 'src/container/task/TaskExecutor';

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
              let formData = await request.formData();
              let name = formData.get('projectName');
              return {
                projectName: 'test2',
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

function Project() {
  // let project = useLoaderData();
  const actionData = useActionData();
  console.log('🚀 ~ file: App.tsx:76 ~ Project ~ actionData:', actionData);
  return (
    <>
      <Form action="/projects/update" method="put">
        <input type="text" name="projectName" />
        <button type="submit">Update Project</button>
      </Form>

      <Form method="delete">
        <button type="submit">Delete Project</button>
      </Form>
    </>
  );
}
