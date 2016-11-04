import _ from 'lodash';
import Tabs from './Tab';
import GridView from './GridView';
import ListView from './ListView';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import Tab from './Tab';
import FlashMessage from './FlashMessage';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import * as ProductActions from '../actions/Product';
import { Filter, ProductRowFilter } from './ProductFilter';

@connect(null, dispatch => (bindActionCreators(ProductActions, dispatch)))

@reduxForm({
  form: 'toolbox'
})


export default class ProductsAvailableView extends Component {
  componentDidMount() {
    let { fetchAvailableProducts, numOfProducts } = this.props;
    fetchAvailableProducts();
  }
  render() {
    let { props } = this;
    let { products } = props;
    let { 
      products: { modal, collection, isLoading, isSearching, isGrid },
    } = props;

    return(
      <div className="main" onClick={(e)=> {
        document.body.classList.remove('menu-open');
      }}>
        {modal ? <FlashMessage {...props} /> : null}
        <Filter {...props}/>
        <Tabs />
        {(isLoading || isSearching) && _.isEmpty(collection) ? 
          <div className="loading">
          </div> :
          <div className="main-content">
          <div className="container">
            <ProductRowFilter {...props}/>
            {isGrid ? <GridView {...props} /> : <ListView {...props} />}
          </div>
          </div>
        }
      </div>
    );
  }
}