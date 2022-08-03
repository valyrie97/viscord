import React from 'react';
import ReactDOM from 'react-dom/client';
import Sidebar from './components/TwoPanel';
import App from './App';
import { createPortal } from 'react-dom';

const container = document.getElementById('app');
if(container !== null) {
  const root = ReactDOM.createRoot(container);
  // const portal = createPortal()
  root.render(<App></App>);
} else {
  throw new Error('Failed to initialize app, container not found!');
}