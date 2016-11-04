import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';

@reduxForm({
  form: 'cp-mailer'
})

export default class ShareProject extends Component {
  componentDidMount() {
    let { props } = this;
    let { data, initialize, type, location: { pathname } } = props;
    if(data) {
      initialize({ data, type });
    } 
  } 
  render() {
    let { props } = this;
    let { closeMailer, sendMail, data , location: { query }, handleSubmit, submitSucceeded } = props;
    if(data) {
      return(
        <div className="mailer">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-4 col-md-offset-4 col-lg-4 col-lg-offset-4">
                <div className="panel panel-default">
                  <div className="panel-heading">
                    <span><i className="fa fa-envelope-o" aria-hidden="true"></i> Send mail 
                    <a href="#" style={{float: 'right'}} onClick={(e) => {
                      e.preventDefault();
                      closeMailer();
                    }}><span className="glyphicon glyphicon-remove"></span></a></span>
                  </div>
                  <div className="panel-body">
                    <form onSubmit={handleSubmit((props) => {
                      sendMail(props);
                    })}>
                    <div className="form-group">
                      <Field autoComplete="off" 
                        style={ { height: '2.375rem', textTransform: 'none' } } 
                        placeholder="To"
                        className="form-control" 
                        type="text" 
                        name="receipient" 
                        component="input" />
                    </div>
                    <div className="divider"></div>
                    <div className="form-group">
                      <Field autoComplete="off" 
                        style={ { height: '2.375rem', textTransform: 'none' } } 
                        placeholder="Subject"
                        className="form-control" 
                        type="text" 
                        name="subject" 
                        component="input" />
                    </div>

                    <div className="divider"></div>
                    <div className="form-group">
                      <Field autoComplete="off" style={ { textTransform: 'none' } } rows="5" className="form-control" type="text" name="message" placeholder="ADDITIONAL NOTES" component="textArea" />
                    </div>
                    <button className="btn btn-block btn-info" disabled={submitSucceeded}>SEND</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> 
      );
      } else {
        return(<div></div>);
      }
  }
}