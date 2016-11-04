import React, { Component } from 'react';

export class OverlayLoader extends Component {
  render() {
    return(
     <div className="loader">
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div>
    </div>
    );
  }
}

export class OverlayWarning extends Component {
  render() {
    return(
    <div>
      <h2>Are you sure you want to delete</h2>
        <br />
        <div className="btn-list">
        <a href="#" className="btn btn-filter" onClick={(e) => {
        e.preventDefault();
        }}>Okay</a>
        <a href="#" className="btn btn-filter btn-dark" onClick={(e) => {
        }}>Cancel</a>
      </div>
      <br />
      <p>{`Action can no longer be undone`}</p>
    </div>
    );
  }
}

export class OverlayPopUp extends Component {
  render() {
    let { props } = this;
    let { actions:  { closePopUp, resetState }, states: { warning } } = props;
    return(
      <div className={`flashmessage text-center`}>
        <div className="close-wrap text-right clearfix">
          <a className="close" onClick={(e) => {
            e.preventDefault();
            closePopUp();
            resetState();
          }}>
          <span className="glyphicon glyphicon-remove"></span>
          </a>
        </div>
        { warning ? <OverlayWarning {...props} /> : null }
      </div>
    );
  }
}

export class OverlayBulkPopUp extends Component {
  render() {
    let { props } = this;
    let { actions:  { closePopUp, resetState }, states } = props;
    return(
      <div className={`flashmessage text-center`}>
        <div className="close-wrap text-right clearfix">
          <a className="close" onClick={(e) => {
            e.preventDefault();
            closePopUp();
            resetState();
          }}>
            <span className="glyphicon glyphicon-remove"></span>
          </a>
        </div>

      </div>
    );
  }
}

export default class OverMessage extends Component {
  render() {
    let { props } = this;
    let { bulk } = props;
    if(!bulk) {
      return(
        <div className={`overlay open`}>
          <OverlayPopUp {...props} />
        </div>
      );
    } else {
        return(
          <div className={`overlay open`}>
            <OverlayBulkPopUp {...props} />
          </div>
        );      
    }
  }
}