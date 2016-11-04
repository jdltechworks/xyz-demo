import _ from 'lodash';
import React, { Component } from 'react';
import ProductCreate from '../components/ProductCreate';
import ProductEdit from '../components/ProductEdit';
import ProductsArchivedView from '../components/ProductsArchivedView';
import ProductsDefaultView from '../components/ProductsDefaultView';
import ProductsCheckedOutView from '../components/ProductsCheckedOutView';
import ProductsAvailableView from '../components/ProductsAvailableView';
import ProductSingleView from '../components/ProductSingleView';

export default class ProductVisibilityFilter extends Component {
  render() {
    let { props } = this;
    let { 
      params: { alphanum },
      location: { pathname }
    } = props;

    let checkEdit = () => {
      if(!_.isUndefined(alphanum)) {
       return _.compact(pathname.replace(/\//g , ' ').split(' ')) || null;
      }
    }
    /**
     * View for edit page
     * @param  {bool} _.includes(checkEdit, 'edit') Check if edit is included
     * @return {object} Return necessary react component
     */
    if(_.includes(checkEdit(), 'edit')) {
      /**
       * @todo  edit page
       */
      return(
        <ProductEdit {...props} />
      );
    }
    /**
     * View for archived, available checkedout
     * @param  {bool} _.isUndefined(alphanum) if params does not exist
     * @return {object} Return a react view
     */
    if(_.isUndefined(alphanum)){
      return(
        <ProductsDefaultView />
      );

    }
    /**
     * View for single product page
     * @param  {bool} _.isNaN(parseFloat(alphanum)) if param is numeric return product singleview
     * @return {object} Return necessary view for single product page
     */
    if(_.isNaN(parseFloat(alphanum))) {
      if(!_.eq(alphanum, 'create')) {
        if(_.eq(alphanum, 'archived')){
          return(
            <ProductsArchivedView />
          );         
        } else {
          if(_.eq(alphanum, 'available')){
            return(
              <ProductsAvailableView />
            );  
          }
          return(
            <ProductsCheckedOutView />
          );
        }
        
      } else {
        /**@todo Product add page*/ 
        return(
          <ProductCreate {...props}/>
        );
        
      }
    } else {
      return(
        <ProductSingleView />
      );
    }
  
  }
}