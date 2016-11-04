import _ from 'lodash';
import Tabs from './Tab';
import moment from 'moment';
import Chance from 'chance';
import Preview from './Preview';
import FlashMessage from './FlashMessage';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { USER } from '../fields/User';
import { browserHistory, Link } from 'react-router';
import { Field, Fields, reduxForm } from 'redux-form';
import * as UserActionCreators from '../actions/User';
import { oneColumnField } from '../helpers';


export const validate = (values) => {
  const errors = {};
  _.each(USER, (type, field) => {
    if(type.required) {
      if(!values[field]) {
        errors[field] = `${field} is blank`;
      }      
    }
  });
  return errors;
}

@reduxForm({
  form: 'add-user',
  validate
})

export default class UserCreate extends Component {
  render() {
    let { props } = this;
    let { handleSubmit, 
          pristine, 
          submitting, 
          reset,
          dispatch,
          users: { modal, isLoading, isSubmitting },
          auth: { credentials },
          initializeSubmitUser
    } = props;
      if (isLoading)  {
        return(        
        <div className="main">
          <div className="loading"></div>
        </div>);
      } else {
        return(
          <div className="container" onMouseEnter={(e) => {
            document.body.classList.remove('menu-open');
          }}>
            { modal ? <FlashMessage {...props} /> : null }
            <div className="col-md-12">
              <div className="row">
                <br /> <br />
                <form onSubmit={handleSubmit((payload, e) => {
                    initializeSubmitUser(_.merge(payload, { credentials }));
                  })}>
                  <Fields names={['firstName', 'lastName', 'email', 'password']} component={oneColumnField}/>
                    <button className="paging-btn btn btn-block">
                      SUBMIT 
                    </button>
                  <br />
                  <br />
                </form>
              </div>
            </div>
          </div>
        );
      }
  }
}