import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import * as ActionCreators from '../actions/Auth';
import { reduxForm, Fields } from 'redux-form';
import { AUTH } from '../fields/Auth';
import _ from 'lodash';
import { renderLogin } from '../helpers';
import LoginBackground from '../../../assets/images/Brand_Bg.png';

const validate = (values) => {
  const errors = {};
  _.each(AUTH, (type, field) => {
    if(!values[field]) {
      errors[field] = `${field} is blank`;
    }
  });

  return errors;
}

@connect((state) => {
  return {
    status: state.Auth
  }
}, dispatch => (bindActionCreators(ActionCreators, dispatch)))

@reduxForm({
  form: 'login-form',
  validate
})

export default class Login extends Component {
  componentDidMount() {
  }
  render() {
    let { props } = this; 
    let { status: { isLoggedIn, isChecking } } = props;
    let { handleSubmit, pristine, submitting, reset, Authenticate, status } = this.props;
    if(isChecking === false) {
      return(
        <div className="main">
          <div className="login-form">
            <div className="valign">
              <div className="valign-content">
                <h2>Welcome, log in to access <br />the inventory system</h2>
                <div className="login-panel">
                  <iframe src="dummy.html" name="dummy" className="hidden"></iframe>
                  <form onSubmit={handleSubmit((props, e) => { 
                      Authenticate(props)})} 
                    method="post" target="dummy" >
                    {!(_.isEmpty(status.message)) ?
                      <div className={`alert ${!_.eq(status.message.code, 400) ? 'alert-danger': 'alert-success'}`}>
                        {JSON.stringify(status.message)}
                      </div>
                      : 
                      null
                    }
                   <Fields names={_.keys(AUTH)} component={renderLogin} />
                   <button className="btn btn-primary btn-block">ENTER</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="bottom-banner"><img src={LoginBackground} /></div>
        </div>
      );
    } else {
      return(<div className="main"><div className="loading"></div></div>);
    }
  }
}