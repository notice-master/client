import React from 'react';
// import ReactDOM from 'react-dom';
import * as ReactDOMClient from 'react-dom/client';
import App from './App';
// ReactDOM.render(<App />, document.getElementById('emp-root'));

const container = document.getElementById('emp-root');

const root = ReactDOMClient.createRoot(container!);

// You can later update it.
root.render(<App />);
