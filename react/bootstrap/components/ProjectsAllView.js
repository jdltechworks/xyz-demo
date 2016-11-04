import _ from 'lodash';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { Filter } from './ProductFilter';
import AddImage from '../../../assets/images/add.jpg';
import Thumbnails from './Thumbnails';

export default class ProjectsActiveView extends Component {
  componentWillMount() {
    let { props } = this;
    let { projects: project, fetchAllProjects, fetchProjectItemsComplete, isFetchingProjects } = props;
    fetchAllProjects();
  }
  render() {
    let { props } = this;
    let { location: { pathname }, projects: { isLoading, collection, isSearching } } = props;
    let count = _.size(collection);
    if (count) {
      count--;
    }
    collection = _.chunk(collection, 3);
    return(
      <div className="main" onMouseEnter={(e) => {
        e.preventDefault();
        document.body.classList.remove('menu-open');
      }}>
        <Filter {...props} filterType={"projects"}/>
        <div className="main-content project-container" style={{ paddingBottom: '0', paddingTop: '2.5em' }} >
          <div className="container-fluid">
            <div className="filter">
              <div className="filter-left">
                <span className="search-item-num">{`${count} ITEMS`}</span> 
              </div>
            </div>
            {(isLoading || isSearching) && _.isEmpty(collection) ? 
              <div className="project-loader">
              </div> :
              <div className="project-list">
                <div className="row clearfix">
                  <div className="col-md-12">
                  {_.map(collection, (row, key) => {
                    return(
                      <div key={key} className="row">
                        {_.map(row, (projects, index) => {
                          let { products, name, _id, startDate, endDate, street, suburb } = projects;
                          if(_.isNull(endDate)) {
                            return (
                              <Link key={index} to={_id}>
                                <div className="col-md-4">
                                  <div className="thumbnail">
                                  <div className="thumbnail-image">
                                    <img src={AddImage} />
                                  </div>
                                  </div>
                                </div>
                              </Link>
                            );
                          } else {
                             return(
                              <div key={index} className="col-sm-4 project-set">
                                <Link to={`/projects/${_id}`}>
                                  <div className="wrap">
                                    <div className="checkout-location-btn">
                                      <div className="tool-btns">
                                        <span onClick={(e) => {
                                          e.preventDefault();
                                          let { parentNode: { parentNode } } = e.currentTarget;
                                          parentNode.classList.toggle('active');
                                        }} onMouseLeave={(e) => {
                                          let { parentNode: { parentNode } } = e.currentTarget;
                                          parentNode.classList.remove('active');
                                        }}className="tool-btn lock-btn btn-to-hide"><em className="icon icon-location"></em></span>
                                      </div>
                                    </div>
                                    <ul className="tool-tap">
                                      <li><em className="icon icon-lock"></em>{`UNTIL ${moment(new Date(endDate)).format('MM.DD')}`}</li>
                                      <li><em className="icon icon-location"></em>{`${street}-${suburb}`}</li>
                                    </ul>
                                    <div className="item-thumbnail">
                                      <div className="thumbnail-image">
                                        <ul className="image-list">
                                          <Thumbnails products={products} />
                                        </ul>
                                       </div>
                                        <div className="row">
                                          <div className="col-md-12">
                                          <h3 style={{ color: '#fff' }}>{name}</h3>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </Link>
                                </div>
                              );                           
                            }
                        })}
                      </div>
                    );
                  })}
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}