import React from 'react';
import ReactDOM from 'react-dom';
import logger from 'redux-logger';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import createHistory from 'history/createBrowserHistory';
import io from 'socket.io-client';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import AppReducer from './App.reducer';
import AppRouter from './App.routes';
import configureMalcolmSocketHandlers from './malcolm/malcolmSocketHandler';
import buildMalcolmReduxMiddleware from './malcolm/malcolmReduxMiddleware';
import { malcolmGetAction } from './malcolm/malcolmActionCreators';

require('typeface-roboto');

const history = createHistory();
const router = routerMiddleware(history);

const socket = io('http://localhost:8000', {
  transports: ['websocket'],
});

const malcolmReduxMiddleware = buildMalcolmReduxMiddleware(socket);

const middleware = [router, thunk, malcolmReduxMiddleware];
if (process.env.NODE_ENV === `development`) {
  middleware.push(logger);
}

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */

const store = createStore(
  AppReducer,
  composeEnhancers(applyMiddleware(...middleware))
);

configureMalcolmSocketHandlers(socket, store);

// example dispatch, this will be deleted
store.dispatch(malcolmGetAction(['BL18I:XSPRESS3', 'state', 'value']));

ReactDOM.render(
  <Provider store={store}>
    <div>
      <ConnectedRouter history={history}>
        <div>
          <AppRouter />
        </div>
      </ConnectedRouter>
    </div>
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
