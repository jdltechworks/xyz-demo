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


export default class ProductsArchivedView extends Component {
  componentDidMount() {
    let { fetchArchivedProducts, numOfProducts } = this.props;
    fetchArchivedProducts();
  }
  render() {
    let { props } = this;
    let { products } = props;
    let { 
      products: { collection, modal, isLoading, isSearching, isGrid },
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