import React, { Component } from 'react';

export default class Disabled extends Component {
  render() {
    let style = {
      opacity: '.8'
    }
    return(
      <div className="tools-wrap tool-panel active">
          <div style={style} className="tool-panel-content active">
            <div className="content-inner">
            </div>
          </div>
      </div>
    );
  }
}