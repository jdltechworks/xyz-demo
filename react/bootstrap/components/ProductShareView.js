import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import { ProjectShareGridView } from'./GridView';
import * as ProductActionCreators from '../actions/Product';
import moment from 'moment';

import ProductStatus from './ProductStatus';
import Slider from 'react-slick';

const sliderSettings = {
  dots: true,
  infinite: false,
  slidesToShow: 1,
  slidesToScroll: 1,
  swipeToSlide: true,
  swipe: true,
  speed: 500,
  className: 'swiper-container swiper-container-horizontal',
  dots: true,
  useCss: true,
  touchMove: false,
  dotsClass: 'swiper-pagination swiper-pagination-clickable swiper-pagination-bullets',
  arrows: false
};

export class ImagesSlider extends Component {
  render() {
    let { props } = this;
    let { products: { product } } = props;
    let gallery = () => {
      if(!_.isEmpty(product)) {
        let { images } = product;
        return _.map(images, (image, key) => (
          <div key={key} className="swiper-slide swiper-slide-active">
            <img src={image} alt="" />
          </div>        
        ));
      }     
    }
    
    return(
      <div className="item-main">
        <div className="item-slider">
          <Slider {...sliderSettings}>
            {gallery()}
          </Slider>
        </div>
      </div>
    );
  }
}

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
                  <a className="btn btn-tag btn-tag-white">
                    <span><em>{_.upperCase(tag)}</em></span>
                  </a>
                </li>))}
            </ul>
          ))}
        </div>);     
    } else {
      return (<div></div>);
    }
  }
}

@connect((state) => {
  return {
    products: state.Products
  }
}, dispatch => bindActionCreators(ProductActionCreators, dispatch))

export default class ProductShareView extends Component {
  componentDidMount() {
    let { props } = this;
    let { location: { query }, dispatch, unPackSharedProduct } = props;
    unPackSharedProduct(query);
  }
  render() {
    let { props } = this;
    let { 
      products: { product },
    } = props;
    if(!_.isEmpty(product)) {
      let { description } = product;
      return(
       <div className="main" onMouseEnter={(e) => {
          e.preventDefault();
          document.body.classList.remove('menu-open');
        }}>
        <ProductStatus {...props}/>
        <div className="main-content">
          <div className="container">
            <ImagesSlider {...props} />
            <div className="description-container">
              <h3>DESCRIPTION</h3>
              <p>{description}</p>
            </div>
            <div className="item-desc">
              <TagComponent {...product } />
            </div>
          </div>
        </div>
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