import React, { Component } from 'react';

export default class ProjectSubmit extends Component {
  render() {
    let { props } = this;
    let { pristine, submitting, reset } = props;
    return(
      <div className="bottom-filter">
        <div className="valign">
          <div className="valign-content">
            <button disabled={ pristine } onClick={reset} className="btn btn-filter btn-dark">
              <span className="icon icon-remove-2"></span>
              <span>CANCEL</span>
            </button>
            <button disabled={ pristine } id="submit-project" className="btn btn-filter btn-primary">
              <span className="icon icon-check-white"></span>
              <span>SAVE</span>
            </button>
           </div>
        </div>
      </div>
    );
  }
}