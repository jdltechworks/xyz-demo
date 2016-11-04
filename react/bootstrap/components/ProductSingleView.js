import _ from 'lodash';
import moment from 'moment';
import { connect } from 'react-redux';
import ImageSlider from './ImageSlider';
import { bindActionCreators } from 'redux';
import FlashMessage from './FlashMessage';

import EmailNotifier from './EmailNotifier';
import ProductStatus from './ProductStatus';
import React, { Component } from 'react';
import { Link } from 'react-router';

import * as UsersActionCreators from '../actions/User';
import * as ProductActionCreators from '../actions/Product';
import { getFormValues, Field, reduxForm } from 'redux-form';

import ShareProject from './Share';

export class TagComponent extends Component {
  render() {
    let { props } = this;
    let { categories, styles, palletes, rooms } = props;
    let tags = { categories, styles, palletes, rooms };
    let productKeys = _.keys(props);

    let keys = _.keys(tags);
    if(!_.isEmpty(tags)) {
      return( 
        <div className="clearfix">
          {_.map(keys, (type, i) => (
            <ul key={i} className="tag-list tag-white">
              {_.map(props[type], (tag, key) => (
                <li key={key}>
                  <Link to={`/inventory/manage/${_.lowerCase(tag)}`} className="btn btn-tag btn-tag-white">
                    <span><em>{_.upperCase(tag)}</em></span>
                  </Link>
                </li>))}
            </ul>
          ))}
        </div>);     
    } else {
      return (<div></div>);
    }
  }
}

let FIELDS = {
  project: {
    required: false
  },
  item: {
    required: false
  },
  note: {
    required: false
  }
};

export const validate = (values) => {
  const errors = {};
  _.each(FIELDS, (type, field) => {
    if(type.required) {
      if(!values[field]) {
        errors[field] = `${field} is blank`;
      }      
    }
  });
  return errors;
}

@connect(state => {
  return {
    users: state.User,
    pallete: state.Pallete,
    categories: state.Category,
    style: state.Style,
    rooms: state.Rooms,
    uploads: state.Uploads,
    message: state.Message,
    products: state.Products,
    auth: state.Auth
  };
}, dispatch => bindActionCreators(_.merge(UsersActionCreators, ProductActionCreators), dispatch))


@reduxForm({
  form: 'product-action',
  validate
})

export default class ProductSingleView extends Component {
  componentDidMount() {
    let { params: { alphanum }, fetchProduct, fetchProjectsSelection, fetchUsers } = this.props;
    fetchProduct(alphanum);
    fetchProjectsSelection();
    fetchUsers();
  }
  render() {
    let { props } = this;
    let { 
      products: { product, isSearhing, modal, users, notes }, 
      message: { details }, 
      params: { alphanum },
      location: { pathname },
      mailer
    } = props;
    if(!_.isEmpty(product)) {
       let { description } = product;
      return(
       <div className="main" onMouseEnter={(e) => {
          e.preventDefault();
          document.body.classList.remove('menu-open');
        }}>
        { mailer.modal ? <ShareProject data={product} type="product" {...props} /> : null }
        {modal ? <FlashMessage {...props} /> : null}
        <ProductStatus {...props}/>
        <div className="main-content">
          <div className="container">
            <ImageSlider {...props} />
            <div className="description-container">
              <h3>DESCRIPTION</h3>
              <p>{description}</p>
            </div>
            <div className="item-desc">
              <TagComponent {...product } />
            </div>
          </div>
        </div>
        <EmailNotifier {...props}/>
      </div>
      );
    } else {
      return(
        <div className="main">
          <div className="loading"></div>
        </div>
      );
    }
  }
}