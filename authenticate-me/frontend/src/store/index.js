import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk';
import sessionReducer from './session';

// Create and define the root reducer function. Use combineReducers to incorporate all reducers into the single root reducer as
// only 1 reducer is allowed to be passed to redux
const rootReducer = combineReducers({
    session: sessionReducer,
});

// Initialize an enhancer variable that will be set to different store enhancers depending on if the Node environment is in development or production.
let enhancer;

// In production, the enhancer should only apply the thunk middleware.
// In development, the logger middleware is employed and Redux dev tools compose enhancer as well.
// A logger variable that uses the default export of redux-logger is used in order to allow the use of these tools.
// Then, grab the Redux dev tools compose enhancer with window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ and store it in a variable called composeEnhancers.
// An or || is used to keep the Redux's original compose as a fallback.
if (process.env.NODE_ENV === 'production') {
    enhancer = applyMiddleware(thunk);
} else {
    const logger = require('redux-logger').default; // Import
    const composeEnhancers =
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

// Create the Redux Store
// The configureStore function takes in an optional preloadedState. It returns createStore invoked with the root reducer, the preloadedState, and the enhancer (based upon environment)
const configureStore = (preloadedState) => {
    return createStore(rootReducer, preloadedState, enhancer);
};

// Export configureStore as default. It will be used by index.js to attach the Redux store to the react application.
export default configureStore;
