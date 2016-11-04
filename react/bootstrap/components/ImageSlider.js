import Slider from 'react-slick';
import { ProductToolBox } from './ToolBox';
import React, { Component } from 'react';

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

export default class ImagesSlider extends Component {
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
          <ProductToolBox {...props} />
          <Slider {...sliderSettings}>
            {gallery()}
          </Slider>
        </div>
      </div>
    );
  }
}