import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export class StatusControllerOptions extends Component {
  state = {
    status: null,
    warn: false
  };
  closeWarn(e) {
    this.setState({ warn: false, status: null});
  }
  render() {
    let { state, props } = this;
    let { warn, status } = state;
    let { closeDropDown } = props;
    return(
      <div className="project-status-component">
      {!warn ?         
        <div className="project-status-options">
          <ul className="status-option-dropdown">
            <li><a href="#" onClick={(e) => {
              e.preventDefault();
              this.setState({ warn: true, status: 'CHECKED_OUT'});
            }}><i className="fa fa-lock" aria-hidden="true"></i> &nbsp;CHECK-OUT</a></li>
            <li><a href="#" onClick={(e) => {
              e.preventDefault();
              this.setState({ warn: true, status: 'CHECKED_IN'});
            }}><i className="fa fa-map-marker" aria-hidden="true"></i>&nbsp;CHECK-IN</a></li>
            <li><a href="#" onClick={(e) => {
              e.preventDefault();
              this.setState({ warn: true, status: 'ON_HOLD'});
            }}><i className="fa fa-lock" aria-hidden="true"></i>&nbsp;HOLD</a></li>
          </ul>
        </div> : <StatusWarnComponent status={status} {...props} closeWarn={this.closeWarn.bind(this)} {...props} /> 
      }
      </div>
    );
  }
}

export class StatusWarnComponent extends Component {
  render() {
    let { props } = this;
    let { status, closeWarn, closeDropDown, projects: { project: { key } }, setProjectStatus } = props;
    return(
      <div className="project-status-warn container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <h4>Are you sure you want to set this to {status}?</h4>

            <button className="btn btn-default" style={ { marginRight: '2px' } } onClick={(e) =>{
              setProjectStatus(key, status);
              closeWarn();
              closeDropDown();
              document.getElementById('status').innerText = status.replace('_', '-');
            }}>Yes</button>
            <button className="btn btn-default" style={ { marginLeft: '2px' } } onClick={(e) => {
              e.preventDefault();
              closeWarn();
            }}>No</button>
          </div>
        </div>
      </div>
    );
  }
}

export default class ProjectStatusController extends Component {
  state = {
    openDropdown: false
  };
  closeDropDown() {
    let { state, props } = this;
    let { openDropdown } = state;
    this.setState({ openDropdown: !state.openDropdown});
  }
  render() {

    let { state, props } = this;
    let { openDropdown } = state;
    let { projects: { project: { status } } } = props;
    return(
      <div className={`filter-right project-status`} style={{ lineHeight: '2', padding: '20px 25px 10px'}}>
        <a href="#" className={`btn btn-filter ${openDropdown ? ` active`: `btn-primary`}`} onClick={(e) => {
          e.preventDefault();
          this.setState({ openDropdown: !state.openDropdown});
        }}>
          <i className="fa fa-lock" aria-hidden="true"></i>
          &nbsp;<span id="status">{status ? status.replace('_', '-') : `NOT ASSIGNED`}</span>
        </a>
        <ReactCSSTransitionGroup
          component="div"
          className="project-status-dropdown"
          transitionName="project-status-trans"
          transitionEnterTimeout={200}
          transitionAppearTimeout={100}
          transitionLeaveTimeout={100}
          transitionAppear={true}
        >
          {openDropdown ? 
            <StatusControllerOptions key="key" closeDropDown={this.closeDropDown.bind(this)} {...props} />: null}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}