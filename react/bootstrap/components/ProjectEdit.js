import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, Fields, getFormValues, reduxForm } from 'redux-form';
import { PROJECT } from '../fields/Project';
import FlashMessage from './FlashMessage';
import { Link, browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import * as ProjectActionCreators from '../actions/Project';
import * as ProductActionCreators from '../actions/Product';
import * as ImageActionCreators from '../actions/Image';
import ProjectSubmit from './ProjectSubmit';
import { Filter, ProductRowFilter } from './ProductFilter';
import Preview from './Preview';
import Tabs from './Tab';
import { renderItemsCheckBox, twoColumnFields, startEndDate } from '../helpers';
import ShareProject from './Share';
import Releaser from './Releaser';
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
    projects: state.Projects,
    products: state.Products,
    images: state.Images,
    formValues: getFormValues('edit-project')(state)
  };
}, dispatch => ( bindActionCreators(_.merge(ImageActionCreators, ProjectActionCreators, ProductActionCreators), dispatch)) )


@reduxForm({
  form: 'edit-project',
  validate
})

export default class ProjectEdit extends Component {
  componentDidMount() {
    let { props} = this;
    let { pristine, initialize, 
          projects: { project, isSelectingItems }, 
          fetchProducts, 
          fetchProject,
          params: { alphanum }
        } = props;
    if(pristine) {
      fetchProject(alphanum).then((project) => {
        let removeProject = _.omit(project, ['recentProject, status']);
        initialize(project);
      });
    }
    fetchProducts();
  }
  componentWillUnmount() {
  }
  render() {
    let { props } = this;
    let { handleSubmit, 
          pristine, 
          submitting, 
          reset,
          dispatch,
          location: { pathname },
          params: { alphanum, secondparam, thirdparam },
          projects: { modal, project, isSelectingItems, releaseModal },
          initializeProjectUpdate,
          initializePartialProjectUpdate,
          fetchProducts,
          formValues,
          mailer,
          sendMail,
          closeMailer,
          location
    } = props;
    let mailerProps = { sendMail, closeMailer, location };
    if(thirdparam && isSelectingItems) {
      return(
      <div className="main"onMouseEnter={(e) => {
        e.preventDefault();
        document.body.classList.remove('menu-open');
      }}>
        { mailer.modal ? <ShareProject data={project} type="project" {...mailerProps} /> : null }
        { releaseModal ? <Releaser {...props} /> : null}
        <Preview {...props} />
        <Filter {...props} />
        <Tabs />
        { modal ? <FlashMessage {...props} /> : null }
        <div className="project-list">
          <div className="main-content has-footer">
            <div className="container">
              <ProductRowFilter {...props}/>
              <form onSubmit={handleSubmit((payload, e) => {
                let { formValues: { items } } = this.props; 
                initializeProjectUpdate(payload, items);
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
        { mailer.modal ? <ShareProject data={project} type="project" {...mailerProps} /> : null }
        { releaseModal ? <Releaser {...props} /> : null}
        { modal ? <FlashMessage {...props} /> : null }
          <div className="container">
            <div className="col-md-12">
              <div className="row">
                <br />
                <form onSubmit={handleSubmit((_props) => {
                  let { formValues: { items } } = this.props;
                  dispatch({type: 'IS_SELECTING_ITEMS'});
                  if(_.includes(pathname, 'edit')) {
                    initializePartialProjectUpdate(_props, items);
                  }
                  browserHistory.push(`/projects/${alphanum}/edit/second`);
                })}>
                  <Fields names={['name', 'client']} component={twoColumnFields} />
                  <Fields names={['street', 'suburb']} component={twoColumnFields} />
                  <Fields names={['startDate', 'endDate']} component={startEndDate} />
                  <button className="paging-btn btn btn-block" disabled={submitting}>
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