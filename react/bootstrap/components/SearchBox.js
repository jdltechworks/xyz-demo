import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ProductActions from '../actions/Product';
import * as ProjectActions from '../actions/Project';

@connect(null, dispatch => (bindActionCreators(_.merge(ProductActions, ProjectActions), dispatch)))

export default class renderSearchBox extends Component {
  filterTimeout: null;

  initSearch(e) {
    let { props } = this;
    let { handleSubmit } = props;
    handleSubmit();
  }
  render() {
    let { props, initSearch } = this;
    let { openSearch, closeSearch, initializeKeyWordSearch, searchInProducts, searchInProjects } = props;

    return(
      <div className="navbar-search">
        <input type="text" autoComplete="off" className="form-control"
          onFocus={() => {
            openSearch();
          }}
          onChange={ (e) => {
            let { target: { value } } = e;
            initializeKeyWordSearch(value);
          }}
          onInput={(e) => {
            var query = e.currentTarget.value;
            if (this.filterTimeout) {
              clearTimeout(this.filterTimeout);
            }
            this.filterTimeout = setTimeout(() => {
              searchInProducts(query);
              searchInProjects(query);
            }, 1000);
          }}
          className="form-control" />
        <button type="submit" className="search-btn"></button>
      </div>
    );
  }
}