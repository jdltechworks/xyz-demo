import _ from 'lodash';
import Tabs from './Tab';
import moment from 'moment';
import Chance from 'chance';
import Preview from './Preview';
import FlashMessage from './FlashMessage';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { PROJECT } from '../fields/Project';
import ProjectSubmit from './ProjectSubmit';
import { browserHistory, Link } from 'react-router';
import { Field, Fields, getFormValues, reduxForm } from 'redux-form';
import * as ImageActionCreators from '../actions/Image';
import { Filter, ProductRowFilter } from './ProductFilter';
import * as ProjectActionCreators from '../actions/Project';
import * as ProductActionCreators from '../actions/Product';
import { renderItemsCheckBox, twoColumnFields, startEndDate } from '../helpers';


export const validate = (values) => {
  const errors = {};
  _.each(PROJECT, (type, field) => {
    if(type.required) {
      if(!values[field]) {
        errors[field] = `${field} is blank`;
      }      
    }
  });
  return errors;
}

@connect((state) => { 
  return {
    products: state.Products,
    images: state.Images,
    formValues: getFormValues('add-project')(state)
  };
}, dispatch => ( bindActionCreators(
    _.merge(
      ImageActionCreators, 
      ProjectActionCreators, 
      ProductActionCreators
    ), 
    dispatch)))


@reduxForm({
  form: 'add-project',
  validate
})

export default class ProjectCreate extends Component {
  componentDidMount() {
    let { props } = this;
    let { pristine, initialize, fetchProducts, numOfProducts, projects: { initialValues } } = props;
    let project_id = new Chance();
    
    let natural = project_id.natural(
      {
        min: 0, 
        max: 999999
    })

    if(pristine) {
      initialize(
        {
         '_id': natural,
         'created_at': moment(new Date()).format(),

        }
      );
    }
    if(!_.isUndefined(initialValues)) {
      initialize(initialValues);
    }
    fetchProducts();
    numOfProducts();
  }
  render() {
    let { props } = this;
    let { handleSubmit, 
          pristine, 
          submitting, 
          reset,
          dispatch,
          fetchProducts,
          formValues,
          location: { pathname },
          params: { alphanum, secondparam },
          projects: { modal, project, isSelectingItems },
          products: { collection, isLoading, isFiltered, isSearching },
          initializeSubmitProject
    } = props;
    if(isLoading && _.isEmpty(collection) && !isFiltered && !isSearching) {
      return(        
        <div className="main">
          <div className="loading"></div>
        </div>);
    } else {
    if(secondparam && isSelectingItems) {
      return(
        <div className="main" onMouseEnter={(e) => {
          document.body.classList.remove('menu-open');
        }}>
          <Preview {...props} />
          <Filter {...props} />
          <Tabs {...props} />
          { modal ? <FlashMessage {...props} /> : null }
          <div className="project-list">
            <div className="main-content has-footer">
              <div className="container">
                <ProductRowFilter {...props}/>
                <form onSubmit={handleSubmit((payload, e) => {
                  initializeSubmitProject(payload);
                })}>
                <Field name="items" component={renderItemsCheckBox} {...props} />
                <ProjectSubmit {...props} />
                </form>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return(
        <div className="main" onMouseEnter={(e) => {
          document.body.classList.remove('menu-open');
        }}>
          { modal ? <FlashMessage {...props} /> : null }
          <div className="container">
            <div className="col-md-12">
              <div className="row">
                <br />
                <form onSubmit={handleSubmit((props) => {
                  dispatch({type: 'IS_SELECTING_ITEMS'});

                  browserHistory.push('/projects/create/second');
                })}>
                  <Fields names={['name', 'client']} project={true} component={twoColumnFields} />
                  <Fields names={['street', 'suburb']} component={twoColumnFields} />
                  <Fields names={['startDate', 'endDate']} component={startEndDate} />
                  <button className="paging-btn btn btn-block" disabled={pristine || submitting}>
                  NEXT 
                  <span className="icon icon-next-arrow-white"></span>
                    
                  </button>
                  <br />
                  <br />
                </form>
              </div>
            </div>
          </div>
        </div>
      );
    }
   }
  }
}