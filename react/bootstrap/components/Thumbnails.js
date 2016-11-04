import React, { Component } from 'react';
import _ from 'lodash';

export class DashboardThumbnails extends Component {
  fillFakeImages(collection) {
    let missing = 9 - _.size(collection) + 1;
    let last = _.lastIndexOf(_.clone(collection)) - 1;
    if(!_.eq(missing, 0)) {
      for(var i = 1; i < missing; i++) {

        collection[ last + i ] = { images: [ 'https://dummyimage.com/65.38x65.38/fff/fff' ] };

      }
      return collection;
    } else {
      return collection;
    }
  }
  render() {
    let { props } = this;
    let { products } = props;
    return(
      <ul className="image-list">
        {_.map(this.fillFakeImages(products), (value, i) => {
            let { images } = value;
            return(
              <li key={i}>
                <img src={_.toString(images).split(',')[0]} />
              </li>
            );
        })}
      </ul>
    );
  }
}

export default class Thumbnails extends Component {
  fillFakeImages(collection) {
    let missing = 9 - _.size(collection) + 1;
    let last = _.lastIndexOf(_.clone(collection)) - 1;
    if(!_.eq(missing, 0)) {
      for(var i = 1; i < missing; i++) {

        collection[ last + i ] = { images: [ 'https://dummyimage.com/180x180/fff/fff' ] };

      }
      return collection;
    } else {
      return collection;
    }
  }
  render() {
    let { props } = this;
    let { products } = props;
    return(
      <ul className="image-list">
        {_.map(this.fillFakeImages(products), (value, i) => {
            let { images } = value;
            return(
              <li key={i}>
                <img src={_.toString(images).split(',')[0]} />
              </li>
            );
        })}
      </ul>
    );
  }
}