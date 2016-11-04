import _ from 'lodash';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import ProductSingleView from '../components/ProductSingleView';
import ProductCreate from '../components/ProductCreate';
import ProductEdit from '../components/ProductEdit';
import ProductsArchivedView from '../components/ProductsArchivedView';
import ProductsDefaultView from '../components/ProductsDefaultView';
import ProductsCheckedOutView from '../components/ProductsCheckedOutView';
import ProductsAvailableView from '../components/ProductsAvailableView';
import ManageProductView from '../components/ManageProductView';
import ManageCategories from './Categories';
import { bindActionCreators } from 'redux';
import * as MailerActions from '../actions/Mailer';

@connect((state) => {
  return {
    auth: state.Auth,
    products: state.Products,
    mailer: state.Email
  }
}, dispatch => bindActionCreators(_.merge(MailerActions), dispatch))

export default class Products extends Component {
  
  render() {
    let { props } = this;
    let {
      auth: { isLoggedIn },
      params: { alphanum },
      location: { pathname }
    } = props;

    let checkEdit = () => {
      if(!_.isUndefined(alphanum)) {
       return _.compact(pathname.replace(/\//g , ' ').split(' ')) || null;
      }
    }
    if(isLoggedIn) {
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
    if(_.isUndefined(alphanum) || alphanum == 'search'){
      return(
        <ProductsDefaultView {...props} triggerSearch={alphanum} />
      );

    }

    if(_.eq(alphanum, 'categories')) {
      return(
        <ManageCategories {...props} />
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
            <ProductsArchivedView {...props} />
          );         
        } else {
          if(_.eq(alphanum, 'available')){
            return(
              <ProductsAvailableView {...props} />
            );  
          }
          if(_.eq(alphanum, 'checkedout')) {
            return(
              <ProductsCheckedOutView {...props} />
            );
          }
          if(_.eq(alphanum, 'manage')) {
            
            return(
              <ManageProductView {...props} />
            );
          }
        }
        
      } else {
        /**@todo Product add page*/ 
        return(
          <ProductCreate {...props}/>
        );
        
      }
    } else {
      return(
        <ProductSingleView {...props} />
      );
    }
   } else {
    return(<div></div>);
   }
  }
}