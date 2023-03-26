import { CommonProviders } from '@nmc/common';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import axios from 'axios';
import { routes } from './routes';

import './styled/global.css';
export interface CustomMessage {
  [key: string]: string;
}

const App = () => {
  const router = createBrowserRouter(routes);
  return (
    <CommonProviders>
      <RouterProvider router={router}></RouterProvider>
    </CommonProviders>
  );
};

export default App;
