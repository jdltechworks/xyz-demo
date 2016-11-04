import React, { Component } from 'react';
import GridView from './GridView';

export default class DashboardProducts extends Component {
  componentDidMount() {
    let { props } = this;
    let { fetchProducts } = props;
  }
  render() {
    let { props } = this;
    let {
      products: { collection, isLoading, isFiltered, isSearching }
    } = props;
    if((isLoading || isSearching) && _.isEmpty(collection)) {
      return (
        <div className="loading">
        </div>
      );
    } else {
    return(
      <div className="main-content">
        <div className="container">
          <GridView {...props} />
        </div>
      </div>
    );
   }
  }
}