import React from 'react';
import { Link } from 'react-router';
import { FilterSearch } from './ProductFilter';


export default class DashboardFilter extends React.Component {
  render() {
    let { props } = this;
    
    return (
      <div style={{
        paddingTop: '20px',
        paddingBottom: '10px'
      }} className="filter-bar">
        <div className="container">
          <div className="filter-left">
            <h4 className="search-item-num">ITEMS CHECKED OUT THIS WEEK</h4>
          </div>
          <div className="filter-right">
            <FilterSearch {...props} />
            <Link to="/inventory" className="btn btn-filter">
              <span className="icon icon-eye"></span>VIEW INVENTORY
            </Link>
          </div>
        </div>
      </div>
    );
  }
}