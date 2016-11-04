import _ from 'lodash';
import { Link } from 'react-router';
import $ from 'jquery';
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';

export class TableHeader extends Component {
  render() {
    let { props } = this;
    let { users: { collection } } = props;
    return(
      <thead>
        <tr>
          <th><a href="#">EMAIL ADDRESS</a></th>
          <th>MANAGE</th>
        </tr>
      </thead>
    );
  }
}


export class UserManageField extends Component {

  render(){
  let { isDeletingUser, users: { collection }, auth: { credentials } } = this.props;
    collection = _.uniqBy(collection, 'email');
    return(
      <tbody>
        {_.map(collection, (user, index) => {
          let { email, key } = user;
          return(
            <tr className="selected" key={index}>
              <td>{email}</td>
              <td>
              <button type="button" className="edit-btn" onClick={(e) => {
                e.preventDefault();
                isDeletingUser({ user, credentials });
              }}><span className="icon icon-delete"></span></button>
              </td>
            </tr>);
          })}
      </tbody>
    );
  }
}

export const unique = value => value && _.uniq(value);

export default class UserListView extends Component {
  render() {
    let { props } = this;
    return(
      <div className="table-response">
        <table className="table">
          <TableHeader {...props} />
          <UserManageField {...props} />         
        </table>
      </div>
    );
  }
}