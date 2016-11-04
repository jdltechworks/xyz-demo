import React, { Component } from 'react';
import CountTo from 'react-count-to';
import $ from 'jquery';


export default class UsagePane extends Component {
  componentDidMount() {
    let { props } = this;
    let { stats: { overAllUsage } } = props;
  }
  render() {
    return (
      <div className="reporting-content">
        <h4 className="text-center">INVENTORY USAGE</h4>
        <div className="radial-progress" data-progress="0">
          <div className="circle">
            <div className="mask full">
              <div className="fill"></div>
            </div>
            <div className="mask half">
              <div className="fill"></div>
              <div className="fill fix"></div>
            </div>
          </div>
          <div className="inset">
            <div className="percentage">
              <div className="numbers">
                <span className="counter">0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}