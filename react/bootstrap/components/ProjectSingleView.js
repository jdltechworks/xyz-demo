import React, { Component } from 'react';
import { connect } from 'react-redux';
import FlashMessage from './FlashMessage';
import ShareProject from './Share';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import { ProjectGridView } from'./GridView';
import * as ProjectActionCreators from '../actions/Project';
import moment from 'moment';
import Releaser from './Releaser';
import ProjectStatusController from './ProjectStatusController';


export class ProjectHeader extends Component {
  render() {
    let { props } = this;
    let { projects: { project, isLoading } } = props;
    let { name } = project;
    return(
      <div className="main-top">
        <div className="valign">
          <div className="valign-content">
            <h2>{isLoading ? '...' : _.capitalize(name)}</h2>
          </div>
        </div>
      </div>
    );
  }
}

export class ProjectStatus extends Component {
  render() {
    let { props } = this;
    let { openPopUp, projects: { project, isLoading } } = props;
    let { key, startDate, endDate, street, suburb, client, status } = project;
    let _startDate = _.upperCase(moment(new Date(startDate)).format('MMMM D'));
    let _endDate = _.upperCase(moment(new Date(endDate)).format('D MMMM YYYY'));
    if(!isLoading) {
      return(
        <div className="filter-bar" style={ { paddingRight: '1.25rem'} }>
          <div className="filter-left">
            <div className="info-panel" style={{ lineHeight: '2', padding: '8px 10px 0px'}}>
              <ul className="info-list nav">
                <li><a href="#"><span className="icon icon-calendar-white"></span>{`${_startDate} - ${_endDate}`}</a></li>
                <li><a href="#"><span className="icon icon-location-white"></span>{_.upperCase(`${street} ${suburb}`)}</a></li>
                <li><a href="#"><span className="icon icon-user-white"></span>{_.upperCase(client)}</a></li>
              </ul>
            </div>
          </div>
          {!_.eq(status, 'ARCHIVED') ? <ProjectStatusController {...props} /> : null}
        </div>
      );
    } else {
      return(<div className="filter-bar">
        <div className="filter-left">
          <div className="info-panel" style={{ lineHeight: '2', padding: '8px 10px 0px'}}>
            <ul className="info-list nav">
              <li><a href="#">...</a></li>
            </ul>
          </div>
        </div>
      </div>);     
    }
  }
}

export class ProductControl extends Component {
  componentDidMount() {
  }
  render() {
    let { props } = this;
    let { projects: { project: { products } }, switcher } = props;
    return(
      <div className="filter">
        <div className="filter-left">
          <span className="search-item-num">{`${_.size(products)}`} ITEMS <em className="text-muted">RESERVED FOR THIS PROJECT</em></span> 
        </div>
        <div className="filter-right">
          VIEW AS: <span className="view">
            <a href="#" onClick={(e) => {
              e.preventDefault();
              let { currentTarget: { nextSibling } } = e;
              let { currentTarget } = e;
              switcher(false);
              nextSibling.classList.remove('active');
              currentTarget.classList.add('active');
              
            }}>GRID</a>
            <a href="#" className="active" onClick={(e) => {
              e.preventDefault();
              let { currentTarget: { previousSibling } } = e;
              let { currentTarget } = e;
              switcher(true);
              previousSibling.classList.remove('active');
              currentTarget.classList.add('active');
            }}>MOODBOARD</a>
            </span>
        </div>
      </div>
    );
  }
}

export class MoonBoardTop extends Component {
  render() {
    let { props } = this;
    let { images, isOdd, _id} = props;
    if(isOdd) {
     return(
      <div className="row">
        <Link to={`/inventory/${_id}`}>
          <div className="row">
            <div className="col-xs-9 pull-right">
              <div className="thumbnail">
                <div className="thumbnail-image"><img src={images[0]} alt="" /></div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-11 pull-right">
              <div className="row">
                <div className="col-xs-6">
                  <div className="thumbnail">
                    <div className="thumbnail-image"><img src={images[1]} /></div>
                  </div>
                </div>
                <div className="col-xs-6">
                  <div className="thumbnail">
                    <div className="thumbnail-image"><img src={images[2]} alt="" /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="thumbnail">
            <div className="thumbnail-image"><img src={images[3]} alt="" /></div>
          </div>
        </Link>
      </div>
    );     
   } else {
    return(
      <div className="row">
        <Link to={`/inventory/${_id}`}>
          <div className="thumbnail">
            <div className="thumbnail-image" className="even"><img src={images[0]} alt="" /></div>
          </div>
          <div className="row">
            <div className="col-xs-11">
              <div className="row">
                <div className="col-xs-6">
                  <div className="thumbnail">
                    <div className="thumbnail-image"><img src={images[1]} alt="" /></div>
                  </div>
                </div>
                <div className="col-xs-6">
                  <div className="thumbnail">
                    <div className="thumbnail-image"><img src={images[2]} alt="" /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-9">
              <div className="thumbnail">
                <div className="thumbnail-image"><img src={images[3]} alt="" /></div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    )
   }

  }
  
}

export class MoonBoardCenter extends Component {
  render() {
    let { props } = this;
    return(
      <div className="row">
        <div className="col-xs-11 pull-right">
          <div className="row">
            <div className="col-xs-6">
              <div className="thumbnail">
                <div className="thumbnail-image"><a href="#"><img src={image[1]} /></a></div>
              </div>
            </div>
            <div className="col-xs-6">
              <div className="thumbnail">
                <div className="thumbnail-image"><a href="#"><img src={image[2]} alt="" /></a></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export class MoonBoardView extends Component {
  render() {
    let { props } = this;
    let { projects: { project: { products } } } = props;
    products = _.uniqBy(products, 'key');
    products = _.chunk(products, 2);
    products = _.chunk(products, 2);
    return(
      <div className="project-list">
        <div className="moodboard-layout">
          {_.map(products, (row, key) => (
            <div key={key} className="row">
              {_.map(row, (product, index) => (
                <div key={index} className="col-xs-6">
                  {_.map(product, (prod, i) => {
                    let { images } = prod;
                    images = _.chunk(images, 5)
                    return(<MoonBoardTop key={i} isOdd={Math.abs(i % 2) == 1} {...prod}/>);
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default class ProjectSingleView extends Component {
  state = {
    moonboard: true
  };
  switcher(bool) {
    let { state } = this;
    let { moonboard } = state;

    this.setState({ moonboard: bool });
  }
  componentDidMount() {
    let { params: { alphanum }, dispatch, fetchProject } = this.props;
    fetchProject(alphanum);
  }
  render() {
    let { props, switcher, state: { moonboard } } = this;
    let { props:{ closePopUp, projects: { project, isLoading, modal, releaseModal }, message, message: { popup, bulk }, mailer } } = this;
    
    if(!isLoading) {
      let { _id } = project;
      if(!_id) {
        return(
          <div className="main">
            <div className="main-content">
              <div className="container">
              <h3>Unfortunately project is no longer exist in our records...</h3>
              </div>
            </div>
          </div>
        );
      } else {
       return(
        <div className="main">
          { releaseModal ? <Releaser {...props} /> : null}
          { mailer.modal ? <ShareProject data={project} type="project" {...props} /> : null }
          { modal ? <FlashMessage {...props} /> : null }
          <ProjectHeader {...props} />
          <ProjectStatus  {...props} />
          <div className="main-content">
            <div className="container">
              <ProductControl switcher={switcher.bind(this)} {...props} />
              { moonboard ? <MoonBoardView {...props} /> : <ProjectGridView {...props} /> }
            </div>
          </div>
        </div>
      );       
      }

    } else {
      return(
        <div className="main">
          <ProjectHeader {...props} />
          <ProjectStatus  {...props} />
          <div className="loading"></div>
        </div>
      );
    }
  }
}