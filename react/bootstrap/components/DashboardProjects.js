import _ from 'lodash';
import React, { Component } from 'react';
import { Link } from 'react-router';
import Slider from 'react-slick';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import AddImage from '../../../assets/images/add.jpg';
import { DashboardThumbnails } from './Thumbnails';


export class ProjectProducts extends Component {
  render() {
    let { props: { products } } = this;

    return(
      <DashboardThumbnails products={products} />
    );
  }
}

export default class DashboardProjects extends Component {
  componentDidMount() {
    let { props } = this;
    let { fetchActiveProjects } = props;
    fetchActiveProjects();
  }
  render() {
    let { props } = this;
    let { fetchProjectItems, projects } = props;
    let { productFetched, collection } = projects;
    if(!productFetched) {
      return(
        <div className="project-carousel" style={ { opacity: .7 } }>
          <div className="swiper-slide swiper-slide-active" style={{
            width: '200.167px',
            marginRight: '20px'
          }}>
            <div className="thumbnail">
              <div className="thumbnail-image">
                <Link to='/projects/create'><img src={AddImage} style={ { opacity: 0 } }/></Link>
              </div>
            </div>
            <h4 style={ { opacity: 0 } }>New Project</h4>
          </div>
        </div>
      );
     } else {
      return (
        <ReactCSSTransitionGroup
          component="div"
          className="project-carousel"
          transitionName="carousel"
          transitionEnterTimeout={2000}
          transitionAppearTimeout={600}
          transitionLeaveTimeout={400}
          transitionAppear={true}
        >
          <Slider {...{
            dots: false,
            infinite: false,
            speed: 500,
            slidesToScroll: 1,
            swipe: true,
            className: 'swiper-container swiper-container-horizontal',
            arrows: false
          }}>
            <div className="swiper-container swiper-container-horizontal">
              <div className="swiper-wrapper">
                {_.map(collection, (project, key) => {
                  let { name, products, _id } = project;
                  if(_.eq(key, 0)) {
                    return (
                      <div key={key} className="swiper-slide swiper-slide-active" style={{
                        width: '200.167px',
                        marginRight: '20px'
                      }}>
                        <div className="thumbnail">
                          <div className="thumbnail-image">
                            <Link to='/projects/create'><img src={AddImage} /></Link>
                          </div>
                        </div>
                        <h4>New Project</h4>
                      </div>
                    );
                  } else {
                    return (

                      <div key={key} className="swiper-slide" style={{
                        width: '200.167px',
                        marginRight: '20px'
                      }}>

                        <Link to={`/projects/${_id}`}>
                          <div className="thumbnail">
                            <div className="thumbnail-image">
                              <ProjectProducts {...{products}} />
                            </div>
                          </div>
                          <h4>{name}</h4>
                        </Link>
                      </div> 
                    );               
                 }
                })}
                </div>
              </div>
            </Slider>
          </ReactCSSTransitionGroup>
      );
     }
   }
}