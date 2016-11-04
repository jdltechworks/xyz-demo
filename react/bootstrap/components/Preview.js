import React, { Component } from 'react';
import Slider from 'react-slick';
import _ from 'lodash';

let sliderSettings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToScroll: 1,
  swipe: true,
  className: 'swiper-container swiper-container-horizontal',
  arrows: false
}

export default class Preview extends Component {
  render() {
    let { props } = this;
    let { images: { thumbnail }} = props;
    return (
    <div className="added-items-content">
      <Slider {...sliderSettings}>
        <div className="swiper-container swiper-container-horizontal">
          <div className="swiper-wrapper">
            {_.map(thumbnail, (image, key) => (
              <div key={key} className="swiper-slide swiper-slide" style={{marginRight: '16px'}}>
                <div className="thumbnail">
                  <div className="thumbnail-image">
                    <a href="#"><img src={image} style={{width: '45px', height: '45px'}}/></a>
                  </div>
                </div>
              </div>       
            ))}
            <div className="swiper-slide" style={{marginRight: '16px'}}>
              <div className="thumbnail">
                <div className="thumbnail-image">
                    <a href="#" className="go-to-btn"><span className="icon icon-next-arrow-white"></span></a>
                </div>
              </div>
            </div>         
          </div>
        </div>
      </Slider>
    </div>
    );
  }
}