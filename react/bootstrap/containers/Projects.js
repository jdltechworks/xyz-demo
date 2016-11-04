import _ from 'lodash';
import React, { Component } from 'react';
import ProjectSingleView from '../components/ProjectSingleView';
import ProjectCreate from '../components/ProjectCreate';
import ProjectEdit from '../components/ProjectEdit';
import ProjectsArchivedView from '../components/ProjectsArchivedView';
import ProjectsActiveView from '../components/ProjectsActiveView';
import ProjectsAllView from '../components/ProjectsAllView';
import ProjectsUpcomingView from '../components/ProjectsUpcomingView';
import * as ProjectActions from '../actions/Project';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as MailerActions from '../actions/Mailer';

@connect((state) => {
  return { 
    auth: state.Auth,
    projects: state.Projects,
    message: state.Message,
    route: state.routing,
    mailer: state.Email
  }
}, dispatch => bindActionCreators(_.merge(ProjectActions, MailerActions), dispatch))


export default class ProjectVisibilityFilter extends Component {
  componentDidMount() {
    let { props } = this;
    let {
      auth: { isLoggedIn },
      params: { alphanum },
      location: { pathname },
      route,
      fetchProjects,
      fetchArchivedProjects,
      fetchProject
    } = props;
  }
  componentWillUnmount() {
    let { props } = this;
    let { isFetchingProjects } = props;
    isFetchingProjects();
  }
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
        <ProjectEdit {...props} />
      );
    }
    /**
     * View for archived, available checkedout
     * @param  {bool} _.isUndefined(alphanum) if params does not exist
     * @return {object} Return a react view
     */
    if(_.isUndefined(alphanum)){
      return(
        <ProjectsAllView {...props} />
      );

    }
    /**
     * View for single Project page
     * @param  {bool} _.isNaN(parseFloat(alphanum)) if param is numeric return Project singleview
     * @return {object} Return necessary view for single Project page
     */
    if(_.isNaN(parseFloat(alphanum))) {
      if(!_.eq(alphanum, 'create')) {
        if(_.eq(alphanum, 'archived')){
          return(
            <ProjectsArchivedView {...props} />
          );         
        } else if(_.eq(alphanum, 'active')){
          return(
            <ProjectsActiveView {...props} />
          );
        } else if(_.eq(alphanum, 'upcoming')){
          return(
            <ProjectsUpcomingView {...props} />
          );
        } else {
          return(
            <ProjectsAllView {...props} />
          );
        }
        
      } else {
        /**@todo Project add page*/ 
        return(
          <ProjectCreate {...props} />
        );
        
      }
    } else {
      return(
        <ProjectSingleView {...props} />
      );
    }
   } else {
    return(<div></div>);
   }
  }
}