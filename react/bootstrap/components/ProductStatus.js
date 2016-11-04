import React, { Component } from 'react';
import moment from 'moment';

export default class ProductStatus extends Component {
  render() {
    let { props } = this;
    let { products: { product: { usage, status, deleted_at } } } = props;
    if(status) {
      let { products: { product: { recentProject: { startDate, street, suburb, endDate } } } }= props;
      return(
        <div className="filter-bar">
          <div className="info-panel">
            <ul className="info-list nav" style={ { paddingTop: '10px' } }>
                <li><a href="#"><span className="icon icon-lock-white"></span>{ status && !deleted_at ? status : 'ARCHIVED' }</a></li>
                <li><a href="#"><span className="icon icon-location-white"></span>{`${_.upperCase(street)} - ${_.upperCase(suburb)}`}</a></li>
                <li>
                  <a href="#"><span className="icon icon-clock-white"></span> 
                    {`RETURNS ${!_.isUndefined(endDate) ?  moment(new Date(endDate)).format('MM.DD.YYYY') : `NONE`}`}
                  </a></li>
                <li><a href="#"><span className="icon icon-usage-white"></span>USAGE: { usage ? usage : 0 }</a></li>
            </ul>
          </div>
        </div>
       );
    } else {
      return(
        <div className="filter-bar">
          <div className="info-panel">
            <ul className="info-list nav" style={ { paddingTop: '10px' } }>
                <li><a href="#"><span className="icon icon-lock-white"></span>{deleted_at ? 'ARCHIVED' : 'AVAIABLE' }</a></li>
                <li><a href="#"><span className="icon icon-location-white"></span>IN WAREHOUSE</a></li>
                <li>
                  <a href="#"><span className="icon icon-clock-white"></span>RETURNS 
                    NONE
                  </a></li>
                <li><a href="#"><span className="icon icon-usage-white"></span>USAGE: { usage ? usage : 0 }</a></li>
            </ul>
          </div>
        </div>
       );      
    }
  }
}