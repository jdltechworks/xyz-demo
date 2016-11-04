import _ from 'lodash';
import { Link } from 'react-router';
import $ from 'jquery';
import moment from 'moment';
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import CustomInfiniteScroll from './CustomInfiniteScroll';

export class TableHeader extends Component {
  tableHeadings = {
    'name': 'NAME',
    '_id': 'SKU#',
    'purchaseDate': 'PURCHASED',
    'price': 'PRICE',
    'itemCount': 'USAGE'
  }
  componentDidMount() {
    let { props } = this;
    let { numOfProducts } = props;
    numOfProducts();
  }
  render() {
    let { props } = this;
    let { products: { count, collection, orderByKey, sorted }, 
          sortBy } = props;
    let unsorted = true;
    collection = _.flatten(collection);
    return(
      <thead>
        <tr>
          <th>{_.size(collection)} ITEM{ _.size(collection) == 1 ? `` : `S` }</th>
          {_.map(this.tableHeadings, (value, key) => {
            return (
              <th key={key}><a onClick={(e) => {
                e.preventDefault();
                sortBy({ collection, type: key});
                // $(e.currentTarget).toggleClass('active reverse');
              }} href="#" className={`select-form sort-link ${orderByKey == key && sorted ? 'active' : 'reverse'}`}>{value}</a></th>
            )
          })}
          <th>MANAGE</th>
        </tr>
      </thead>
    );
  }
}


export class ManageField extends Component {
  render(){
  let {
    products: { collection },
    array,
    input,
    isDeletingProduct, 
    fetchProduct
  } = this.props;
  let { value } = input;

  return(
    <tbody>
      {_.map(_.uniqBy(collection, 'key'), (product, index) => {
        let { name, price, _id, images, purchaseDate, itemCount, key, usage } = product;
        return(
          <tr className="selected" key={index}>
            <td>
              <div className="sort-checkbox">
                <label className="control checkbox">
                <input type="checkbox" onChange={(e) => {
                  if(_.eq(value.indexOf(key, 0), -1)) {
                    array.push(input.name, key);  
                  } else {
                    for (var i in value) {
                      if(_.eq(value[i], key)) {
                        array.remove(input.name, i);
                      }  
                    }      
                  }
                }} checked={_.includes(value, key) ? true : false}/>
                <span className="control-indicator"></span>
                </label>
              </div>
              <div className="thumbnail-image">
                <Link to={`/inventory/${_id}`}>
                  <img src={_.toString(images).split(',')[0]} alt="" style={{width: '72px', height: '72px'}}/>
                </Link>
              </div>
            </td>
            <td>{name}</td>
            <td>{_id}</td>
            <td>{moment(new Date(purchaseDate)).format('DD MMMM YYYY')}</td>
            <td>$ {price}</td>
            <td>{usage}</td>
            <td>
              <div className="manage-controls">
                <Link to={`/inventory/${_id}/edit`} className="edit-btn"><span className="icon icon-edit"></span></Link>
                <button type="button" className="edit-btn" onClick={(e) => {
                  e.preventDefault();
                  isDeletingProduct({ key });
                  fetchProduct(_id);
                }}><span className="icon icon-delete"></span></button>
              </div>
            </td>
          </tr>
        );
      })}
    </tbody>
   );
  }
}

export const unique = value => value && _.uniq(value);

export default class ListView extends Component {
  render() {
    let { props } = this;
    let {
      products: { collection, count, isEndOfProductsList, isLoading, isSearching },
      loadNextProducts
    } = props;

    return(
      <div className="table-response sorting-content">
        <CustomInfiniteScroll loader={<div className="loader">Loading...</div>}
        loadMore={loadNextProducts.bind(this)}
        hasMore={!isLoading && !isEndOfProductsList && !isSearching}>
          <table className="table">
            <TableHeader {...props} />
            <Field name="products" normalize={unique} component={ManageField} {...props} />         
          </table>
        </CustomInfiniteScroll>
        {!isEndOfProductsList ? <div className="loader">Loading...</div> : null}
      </div>
    );
  }
}