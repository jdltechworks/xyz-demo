import { connect } from 'react-redux';
import ManageSubmitButton from './ManageSubmitButton';
import FlashMessage from './FlashMessage';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import * as ProductActions from '../actions/Product';
import * as ProjectActions from '../actions/Project';
import { Filter, ProductRowFilter } from './ProductFilter';
import { getFormValues, Field, reduxForm } from 'redux-form';
import ListView from './ListView';
import _ from 'lodash';

@connect((state) => {
  return {
    products: state.Products,
    formValues: getFormValues('manage-form')(state)
  };
}, dispatch => (bindActionCreators(ProductActions, dispatch)))

@reduxForm({
  form: 'manage-form'
})

export default class ManageProductView extends Component {
  componentDidMount() {
    let { fetchProducts, numOfProducts } = this.props;
    fetchProducts();
    numOfProducts();
  }
  render() {
    let { props } = this;
    let { 
      products: { collection, modal, isLoading, isFiltered, isSearching },
      handleSubmit,
    } = props;

    return(
      <div className="main" onClick={(e)=> {
        document.body.classList.remove('menu-open');
      }}>
        {modal ? <FlashMessage {...props} /> : null}
        <Filter {...props}/>
          {(isLoading || isSearching) && _.isEmpty(collection) ? 
            <div className="loading">
            </div> :
            <div className="main-content has-footer">
            <div className="container sorting-content">
              <ListView {...props} />
            </div>
            </div>
          } 
        <ManageSubmitButton {...props} />
      </div>
    );
  }
}