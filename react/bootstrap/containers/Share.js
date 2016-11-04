import React, { Component } from 'react';
import Header from '../components/Header';
export default class Share extends Component {
  render() {
    let { props } = this;
    let { children } = props;
    return(
      <div className="wrapper container-fluid">
        <div className="row">
          <Header {...props} />
          {children}
        </div>
      </div>
    );
  }
}