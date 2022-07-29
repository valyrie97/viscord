import React from 'react';
import ReactDOM from 'react-dom/client';
import Sidebar from './components/Sidebar';
import App from './pages/App';

const container = document.getElementById('app');
if(container !== null) {
  const root = ReactDOM.createRoot(container)
  root.render(<App></App>);
} else {
  throw new Error('Failed to initialize app, container not found!');
}