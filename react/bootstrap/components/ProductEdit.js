import _ from 'lodash';
import { connect } from 'react-redux';
import moment from 'moment';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import SubmitButton from './SubmitButton';

import FlashMessage from './FlashMessage';

import { Field, Fields, reduxForm } from 'redux-form';
import { renderField, 
         renderUpload, 
         prefixProductFields, 
         twoColumnFields,
         threeColumnfields,
         renderTags,
         renderOrphanedField
       } from '../helpers';
import * as StyleActionCreator from '../actions/Style';
import * as RoomsActionsCreator from '../actions/Room';
import * as PalleteActionCreator from '../actions/Pallete';
import * as CategoryActionCreator from '../actions/Category';
import * as UploadActionCreators from '../actions/Uploads';
import * as MessageActionCreator from '../actions/Message';
import * as ProductActionCreators from '../actions/Product';
import { TAGS, IMAGE_UPLOAD, PREFIX_BOTTOM, 
         ORPHANED_FIELD, TOP_PRODUCT, SUFFIX_BOTTOM } from '../fields/Product';
import ShareProject from './Share';



/**
 * 
 * @todo remove unecessary action for performance
 */
let mergedActions = _.merge(
  RoomsActionsCreator,
  StyleActionCreator, 
  PalleteActionCreator, 
  CategoryActionCreator,
  UploadActionCreators,
  MessageActionCreator,
  ProductActionCreators
);

const validate = (values) => {
  const errors = {};
  _.each(SUFFIX_BOTTOM, (type, field) => {
    if(!values[field]) {
      errors[field] = `${field} is blank`;
    }
  });
  _.each(PREFIX_BOTTOM, (type, field) => {
    if(!values[field]) {
      errors[field] = `${field} is blank`;
    }
  });
  _.each(ORPHANED_FIELD, (type, field) => {
    if(!values[field]) {
      errors[field] = `${field} is blank`;
    }
  });
  _.each(TOP_PRODUCT, (type, field) => {
    if(!values[field]) {
      errors[field] = `${field} is blank`;
    }
  });
  _.each(IMAGE_UPLOAD, (type, field) => {
    if(!values[field]) {
      errors[field] = `${field} is blank`;
    }
  });

  _.each(TAGS, (type, field) => {
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
    pallete: state.Pallete,
    categories: state.Category,
    style: state.Style,
    rooms: state.Rooms,
    uploads: state.Uploads,
    message: state.Message,
    products: state.Products
  };
}, dispatch => (
  bindActionCreators(mergedActions, dispatch)))

@reduxForm({
  form: 'edit-product',
  validate
})

export default class ProductEdit extends Component {
  state = {
    rooms: [],
    palletes: [],
    styles: [],
    categories: [],
    purchaseDate: null
  };
  componentDidMount() {
    let { fetchStyle, 
          fetchRooms, 
          fetchPallete, 
          fetchCategories,
          fetchProduct,
          params: { alphanum }
        } = this.props;

    fetchStyle();
    fetchRooms();
    fetchPallete();
    fetchCategories();
    fetchProduct(alphanum);
  }
  componentDidUpdate() {
    let { 
      products: { product },
      initialize,
      pristine
    } = this.props;

    if(pristine) {
      initialize(_.merge(product, 
        { updated_at: moment(new Date()).format() }
      ));
    }
  }
  render() {
    let { props } = this;
    let {
      handleSubmit, 
      pristine, 
      submitting, 
      reset,
      style: { styleTags },
      rooms: { roomsTags },
      pallete: { palleteTags },
      categories: { categoriesTags },
      products: { product, modal },
      initializeProductUpdate,
      mailer,
      sendMail,
      closeMailer,
      location
    } = props;
    let mailerProps = { sendMail, closeMailer, location };
    if(_.isEmpty(product)) {
      return(
        <div className="main">
          <div className="loading"></div>
        </div>
      );
    } else {
      return(
        <div className="main">
          { mailer.modal ? <ShareProject data={product} type="product" {...mailerProps} /> : null }
          <form onSubmit={handleSubmit((props, e) => {
              initializeProductUpdate(props);
            })}>
            {modal ? <FlashMessage {...props} /> : null}
            <div className="heading-bar heading-bar-dark no-margin" >
              <h2>Add photos:</h2>
            </div>
            <div className="container add-photos-error" style={{marginTop: '1.5em'}}></div>
              <Field name="images" type="hidden" component={renderUpload} {...props}/>
            <div className="heading-bar no-margin">
              <h2>Edit item details:</h2>
            </div>
              <div className="main-content has-footer">
                <div className="container">
                  <Fields names={_.keys(TOP_PRODUCT)} component={threeColumnfields} />
                  <Field name={_.keys(ORPHANED_FIELD)[0]} component={renderOrphanedField} />
                  
                  <h2>Category</h2>

                  <Field name="categories" 
                    type="text" 
                    component={renderTags} 
                    tags={categoriesTags} 
                    {...props}/>
                  
                  <h2>Style</h2>
                  
                  <Field 
                    name="styles" type="text" 
                    component={renderTags} 
                    tags={styleTags} 
                    {...props}/>
                  <h2>Palette</h2>
                  
                  <Field 
                    name="palletes" 
                    type="text" 
                    component={renderTags} 
                    tags={palleteTags} 
                    {...props}/>
                  
                  <h2>Rooms</h2>
                  
                  <Field name="rooms" 
                    type="text" 
                    component={renderTags} 
                    tags={roomsTags} 
                    {...props}/>
                  
                  <h2>Origins</h2>

                  <Fields 
                    names={_.keys(PREFIX_BOTTOM)} 
                    component={prefixProductFields}/>
                  <Fields 
                    names={_.keys(SUFFIX_BOTTOM)} 
                    component={twoColumnFields}/>

                </div>
              </div>
              <SubmitButton {...props}/>
            </form>
          </div>
      );
    }
  }
}