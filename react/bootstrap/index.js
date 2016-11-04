import App from './containers';
import { connect } from 'react-redux';
import { Provider } from 'react-redux';
import Login from './containers/Login';
import React, { Component } from 'react';
import store, { history } from './stores';
import Products from './containers/Products';
import Projects from './containers/Projects';
import Dashboard from './containers/Dashboard';
import NotFound from './containers/NotFound';
import Users from './containers/Users';
import Share from './containers/Share';
import ProjectShareView from './components/ProjectShareView';
import ProductShareView from './components/ProductShareView';
import { checkCredentials } from './actions/Auth';


import { browserHistory, Router, Route, IndexRedirect } from 'react-router';

const Root = () => {
  return(
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={App}>
          <IndexRedirect to="/login"></IndexRedirect>
          <Route path="/login" component={Login}></Route>
          <Route path="/dashboard" component={Dashboard}></Route>
          <Route path="/inventory(/:alphanum)(/:secondparam)" component={Products}></Route>
          <Route path="/projects(/:alphanum)(/:secondparam)(/:thirdparam)" component={Projects}></Route>
          <Route path="/users(/:alphanum)(/:secondparam)(/:thirdparam)" component={Users}></Route>
        </Route>
        <Route path="/share" component={Share}>
          <Route path="/share/project(/:alphanum)" component={ProjectShareView}></Route>
          <Route path="/share/product(/:alphanum)" component={ProductShareView}></Route>
        </Route>
      </Router>
    </Provider>
  );
};

export default Root;