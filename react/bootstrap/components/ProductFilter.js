import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ProductActions from '../actions/Product';
import * as ProjectActions from '../actions/Project';
import Tabs, { getTabCategories, filterByTags } from './Tab';
import $ from 'jquery';

export class ProductRowFilter extends Component {
  toggleView(isGrid) {
    let { dispatch } = this.props;

    dispatch({type: 'PRODUCTS_DEFAULT_VIEW_TYPE', 'payload': isGrid});
  }
  render() {
    let { products: { count, isGrid, isLoading, hasFilters }, fetchProducts, clearFilters } = this.props;

    return(
      <div className="filter">
        <div className="filter-left">
          <div className="filter-item">
            <span className="search-item-num">{count} ITEM{ count == 1 ? `` : `S` } </span> 
          </div>
          {hasFilters ? 
          <a href="#" onClick={(e)=>{
            e.preventDefault();
            clearFilters();
          }}>CLEAR ALL FILTERS 
          <span className="remove-filter">
            <em className="icon icon-remove"></em>
              </span>
            </a> : null
          }
        </div>
        <div className="filter-right">
          VIEW AS: 
          <span className="view">
            <a href="#" className={isGrid ? `active` : ``} onClick={this.toggleView.bind(this, true)}>GRID</a>
            |
            <a href="#" className={!isGrid ? `active` : ``} onClick={this.toggleView.bind(this, false)}>LIST</a>
          </span>
        </div>
      </div>
    );
  }
}


export class Filter extends Component {
  filterTimeout: null;

  render() {
    let { props } = this;

    return(
      <div>
      <div className="filter-bar">
        <ul className="filter-tabs">
          <li>
            <FilterSearch {...props} />
          </li>
          {_.map(getTabCategories(props.filterType), (category, key) => (
            <li key={key}><a href={`#${key}-tab`} className="btn btn-filter" onClick={(e) => {
              e.preventDefault();
              $('a.btn-filter, .tab-pane').removeClass('active');
              
              e.target.classList.add('active');
              let target = document.getElementById(e.target.getAttribute('href').replace('#', ''));
              if (target) {
                target.classList.add('active');
                $(target).click();
              }

            }} data-toggle="tab-trigger">{_.toUpper(key)}</a></li>
          ))}
        </ul>
      </div>
        <Tabs {...props} />
      </div>
    );
  }
}

export class FilterSearch extends Component {
  render() {
    let { props } = this;
    let { filterType } = this.props;

    var filterMethod = props[props.filterType == 'projects' ? 'filterProjects' : 'filterProducts'];

    return (
      <div className="btn btn-filter filter-search">
        <span className="icon icon-search"></span>
        <input type="text" className="search-input" placeholder="SEARCH" 
          onBlur={(e) => {
          let { parentNode } = e.target;
          parentNode.classList.remove('active');
        }}
          onFocus={(e) => {
          let { parentNode } = e.target;
          parentNode.classList.add('active');
        }} onInput={(e) => {
          var query = e.currentTarget.value;
          if (this.filterTimeout) {
            clearTimeout(this.filterTimeout);
          }
          this.filterTimeout = setTimeout(() => {
            filterMethod(query);
          }, 1000);
        }}/>
      </div>
    );
  }
}