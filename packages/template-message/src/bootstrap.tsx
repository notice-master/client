import React from 'react';
import ReactDOM from 'react-dom';
import { CommonProviders } from '@nmc/common';

import App from './App';
import { BrowserRouter } from 'react-router-dom';
ReactDOM.render(
  <CommonProviders>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </CommonProviders>,
  document.getElementById('emp-root')
);
