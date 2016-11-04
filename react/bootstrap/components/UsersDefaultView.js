import React, { Component } from 'react';
import UserListView from './UserListView';
import FlashMessage from './FlashMessage';
import _ from 'lodash';

export default class UsersDefaultView extends Component {
  componentDidMount() {
    let { props } = this;
    let { fetchUsers, auth: { isLoggedIn }, location: { pathname } } = props;
    fetchUsers();
  }
  render() {
    let { props } = this;
    let {
      users: { modal, isLoading, collection }
    } = props;
    if(!isLoading) {
      return(
          <div className="main" onClick={(e)=> {
            document.body.classList.remove('menu-open');
          }}>
            {modal ? <FlashMessage {...props} /> : null}
            <div className="main-content">
              <div className="container">
                 <UserListView {...props} />
               </div>
            </div>
          </div>
      );
    } else {
      return(
        <div className="main">
          <div className="loading"></div>
        </div>
      );
    }
  }
}