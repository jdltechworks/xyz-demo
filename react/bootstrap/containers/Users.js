import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { Component } from 'react';
import UsersDefaultView from '../components/UsersDefaultView';
import UserCreate from '../components/UserCreate';
import * as UserActionCreators from '../actions/User';

@connect((state) => {
  return {
    users: state.User,
    auth: state.Auth
  };
}, dispatch => (bindActionCreators(UserActionCreators, dispatch)))

export default class UsersVisibilityFilter extends Component {
  render() {
    let { props } = this;
    let {
      params: { alphanum },
      location: { pathname }
    } = props;

    let checkEdit = () => {
      if(!_.isUndefined(alphanum)) {
       return _.compact(pathname.replace(/\//g , ' ').split(' ')) || null;
      }
    }
    /**
     * View for user
     * @param  {bool} _.isUndefined(alphanum) if params does not exist
     * @return {object} Return a react view
     */
    if(_.isUndefined(alphanum)){
      return(
        <UsersDefaultView {...props} />
      );
    }

    /**
     * View for single Project page
     * @param  {bool} _.isNaN(parseFloat(alphanum)) if param is numeric return Project singleview
     * @return {object} Return necessary view for single Project page
     */
    if(_.isNaN(parseFloat(alphanum))) {
      if(_.eq(alphanum, 'create')) {
        return(
          <UserCreate {...props} />
        );
      } else {
        return(
          <UsersDefaultView {...props} />
        );
      }
    }
  }
}