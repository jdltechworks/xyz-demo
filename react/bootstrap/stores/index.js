import _ from 'lodash';
import thunk from 'redux-thunk';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { applyMiddleware, createStore, compose } from 'redux';

import mainReducer from '../reducers';

const middlewares = [thunk];

let composeEnhancers = null;
if(_.eq(process.env.NODE_ENV, 'development')) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
} else {
  composeEnhancers = compose;
}

const store = createStore(mainReducer, composeEnhancers(applyMiddleware(...middlewares)));

export const history = syncHistoryWithStore(browserHistory, store);

export default store;