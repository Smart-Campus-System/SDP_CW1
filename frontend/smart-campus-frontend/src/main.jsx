// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';  // Import from 'react-dom/client'
import { Provider } from 'react-redux';
import store from './redux/store';
import App from './App';

// Create a root element and render the app using React 18's `createRoot`
const root = ReactDOM.createRoot(document.getElementById('root'));  // Use createRoot
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
