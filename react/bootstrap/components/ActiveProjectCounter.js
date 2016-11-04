import React from 'react';
import _ from 'lodash';
import $ from 'jquery';
import moment from 'moment';
import CountTo from 'react-count-to';

export default class ActiveProjectCounter extends React.Component {
  
  render() {
    let { props, state } = this;
    let { projects: { badgeCount, collection } } = props;
    if(_.isNaN(badgeCount)) {
       return(
        <div className="reporting-content">
          <h4 className="text-center">ACTIVE PROJECTS</h4>
          <div className="active-counter">{0}</div>
        </div>
      );     
     } else {
      return(
        <div className="reporting-content">
          <h4 className="text-center">ACTIVE PROJECTS</h4>
          <div className="active-counter"><CountTo from={0} to={badgeCount} speed={500} /></div>
        </div>
      );
     }

  }
}