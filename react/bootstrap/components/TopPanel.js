import UsagePane from './UsagePane';
import React, { Component } from 'react';
import UsageOverTimePane from './UsageOvertimePane';
import ActiveProjectCounter from './ActiveProjectCounter';

export default class TopPanel extends Component {
  render() {
    let { props } = this;
    return (
      <div className="panel panel-default">
        <div className="panel-body">
          <div className="reporting-panel">
            <ActiveProjectCounter {...props}/>
            <UsagePane {...props}/>
            <UsageOverTimePane {...props}/>
          </div>
        </div>
      </div>
    );
  }
}