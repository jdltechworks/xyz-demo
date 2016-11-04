import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { createGroupedArray } from '../ui-events';
import assignStatusAction from '../helpers/inventory';
import ProductsToolBox from './ToolBox';
import * as ProductActions from '../actions/Product';
import CustomInfiniteScroll from './CustomInfiniteScroll';

let no_image = '//dummyimage.com/420x420/000/fff.png&text=No+Image';

export class ProjectGridView extends Component {
  render() {
    let { props } = this;
    let { isDeletingProduct, projects: { project: { products } } } = props;
    products = _.uniqBy(products, '_id');
    products = _.chunk(products, 3);
    
    if(!_.isEmpty(products)) {
      return (
        <div className="project-list products">
          {_.map(products, (row, i) => (
            <div className="row" key={i}>
              {row.map((product, index) => {
                
                let { images, _id, name } = product;
                
                let centerImg = {
                  background: "url('" 
                  + (images !== undefined ? images[0]: no_image) 
                  + "') no-repeat scroll center center #fff",
                  width: '100%'
                };
                
                let captionBg = {
                  backgroundColor: '#fff'
                };
                
                return( 
                <div className="col-sm-4" key={index}>
                  <div className="thumbnail">
                    <div className="tools-wrap tool-panel">
                      <div className="checkout-location-btn">
                        <div className="tool-btns">
                          <span className="tool-btn lock-btn btn-to-hide" style={ { background: '#b5d8c9' } } onClick={(e) => {
                              let { key } = product;
                              isDeletingProduct(key);
                            }}>
                            <em className="icon icon-remove"></em>
                          </span>
                        </div>
                      </div>
                    </div>
                  <Link to={`/inventory/${_id}`}>
                    <div className="thumbnail-image" style={centerImg}></div>
                  </Link>
                    <div style={captionBg} className="thumbnail-desc">
                      <p>
                        <a href="#">
                        <span className="item-title">{name}</span>
                        <span className="item-num">{'#' + _id}</span>
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              )})}
            </div>
          ))}
        </div>
      );
    } else {
      return(<div></div>)
    }
  }
}

export class ProjectShareGridView extends Component {
  render() {
    let { props } = this;
    let { isDeletingProduct, projects: { project: { products } } } = props;

    products = _.chunk(products, 3);
    
    if(!_.isEmpty(products)) {
      return (
        <div className="project-list products">
          {_.map(products, (row, i) => (
            <div className="row" key={i}>
              {row.map((product, index) => {
                
                let { images, _id, name } = product;
                
                let centerImg = {
                  background: "url('" 
                  + (images !== undefined ? images[0]: no_image) 
                  + "') no-repeat scroll center center #fff",
                  width: '100%'
                };
                
                let captionBg = {
                  backgroundColor: '#fff'
                };
                
                return( 
                <div className="col-sm-4" key={index}>
                  <div className="thumbnail">
                    <div className="tools-wrap tool-panel">
                      <div className="checkout-location-btn">
                      </div>
                    </div>
                    <div className="thumbnail-image" style={centerImg}></div>
                    <div style={captionBg} className="thumbnail-desc">
                      <p>
                        <a href="#">
                        <span className="item-title">{name}</span>
                        <span className="item-num">{'#' + _id}</span>
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              )})}
            </div>
          ))}
        </div>
      );
    } else {
      return(<div></div>)
    }
  }
}

export default class GridView extends Component {
  render() {
    let { props } = this;
    let {
      products: { collection, count, isEndOfProductsList, isLoading, isSearching },
      loadNextProducts
    } = props;

    if(!_.isEmpty(collection)) {
      collection = _.chunk(collection, 3);

      return (
        <div className="project-list products">
          <CustomInfiniteScroll loader={<div className="loader">Loading...</div>}
            loadMore={loadNextProducts.bind(this)}
            hasMore={!isLoading && !isEndOfProductsList && !isSearching}>
            {_.map(collection, (row, key) => (
              <div className="row" key={key}>
                {row.map((product, index) => {
                  
                  let { images, _id, name } = product;
                  
                  let centerImg = {
                    background: "url('" 
                    + (images !== undefined ? images[0]: no_image) 
                    + "') no-repeat scroll center center #fff",
                    width: '100%'
                  };
                  
                  let captionBg = {
                    backgroundColor: '#fff'
                  };
                  
                  return <div className="col-sm-4" key={index}>
                    <div className="thumbnail">
                      <ProductsToolBox _product={product} {...props}/>
                      <Link to={`/inventory/${_id}`}>
                        <div className="thumbnail-image" style={centerImg}></div>
                      </Link>
                        <div style={captionBg} className="thumbnail-desc">
                          <p>
                            <a href="#">
                            <span className="item-title">{name}</span>
                            <span className="item-num">{'#' + _id}</span>
                            </a>
                          </p>
                        </div>
                    </div>
                  </div>
                })}
              </div>
            ))}
          </CustomInfiniteScroll>
          {!isEndOfProductsList ? <div className="loader">Loading...</div> : null}
        </div>
      );
    } else {
      return(<div></div>)
    }
  }
}