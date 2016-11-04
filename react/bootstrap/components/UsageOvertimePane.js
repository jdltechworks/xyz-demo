import React, { Component } from 'react';
import $ from 'jquery';
import _ from 'lodash';
import moment from 'moment';
import API from '../config';

var collection = API.database();
const _products = collection.ref('/items');
const _releases = collection.ref('/release_items');
const _usage = collection.ref('/usage');

export default class UsageOverTimePane extends Component {
  usage = [];
  componentDidMount() {
  }
  render() {
    let { stats: { usageOverTime } } = this.props;

    if(!_.isEmpty(usageOverTime)) {
      return (
        <div className="reporting-content">
          <h4>USAGE OVER TIME</h4>
          <ul className="graph">
          {_.map(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], (month, key) => {
            var computation = 0;
            if (usageOverTime[month]) {
              computation = _.sumBy(usageOverTime[month], (item) => { return item.usage }) / (usageOverTime[month] ? usageOverTime[month].length : 0);
            }
            return (
              <li key={key}>
                <div className="graph-bar">
                  <div className="graph-anim" rel={computation}></div>
                </div>
                <span className="graph-text">{month.charAt(0)}</span>
              </li>
            )
          })}
          </ul>
        </div>
      );
   } else {
    return(
      <div className="reporting-content">
        <h4>USAGE OVER TIME</h4>
        <ul className="graph">
        {_.map(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], (month, key) => {

          return (
            <li key={key}>
              <div className="graph-bar">
                <div className="graph-anim" rel={0}></div>
              </div>
              <span className="graph-text">{month.charAt(0)}</span>
            </li>
          )
        })}
        </ul>
      </div>
    );
   }
  }
}