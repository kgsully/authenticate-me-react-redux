import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import * as sessionActions from './store/session';

// BrowserRouter from React Router used for routing and Provider from redux to provide the attached Redux store to the React appliaction
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from './App';

import { restoreCSRF, csrfFetch } from './store/csrf';

// Import configureStore to attach the Redux store to the React appliaction
import configureStore from './store';

const store = configureStore();

// If not in the production environment:
// - Call the restoreCSRF function (which uses csrfFetch) to get the XSRF-TOKEN on the frontend
// - Attach the custom csrfFetch function onto the window
// - Set the store onto the window for debugging purposes
if (process.env.NODE_ENV !== 'production') {
  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions;
}

// Root functional component defined to wrap the App functional component in Redux's Provider and ReactRouter DOM's BrowserRouter provider components
// Ensure the store is passed into the Provider with a key of store
function Root() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById('root')
);
