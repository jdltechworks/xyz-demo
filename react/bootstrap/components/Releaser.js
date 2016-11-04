import React, { Component } from 'react';
import { reduxForm, Fields, Field } from 'redux-form';
import size from 'lodash/size';
import isUndefined from 'lodash/isUndefined';
import uniqBy from 'lodash/uniqBy';
import { upperCase } from 'lodash/upperCase';
import moment from 'moment';
import DatePicker from 'react-pikaday-component';


export class ManageReleaseField extends Component {
  render(){
  let { props } = this;
  let properFields = _.omit(props, ['names', 'products']);
  let { products } = props;
  products = uniqBy(products, 'key');
  return(
    <tbody>
      {_.map(products, (product, index) => {
        let { name, price, _id, images, purchaseDate, itemCount, key, usage } = product;
        return(
          <tr className="selected" key={index}>
            <td>
              <div className="thumbnail-image">
                <img src={_.toString(images).split(',')[0]} alt="" style={{width: '72px', height: '72px'}}/>
              </div>
            </td>
            <td>{name}</td>
            <td>{_id}</td>
            <td>{moment(new Date(purchaseDate)).format('DD MMMM YYYY')}</td>
            <td>$ {price}</td>
            <td>{itemCount - properFields[key].input.value}</td>
            <td>
              <div className="form-group">
                <input type="number" min="0" max={itemCount} {...properFields[key].input} onChange={(_value) => {
                  properFields[key].input.onChange(_value); 
                }} />
              </div>
            </td>
          </tr>
        );
      })}
    </tbody>
   );
  }
}

export const releaseDate = (_field) => {
  let { input, meta: { error, touched } } = _field;
  return(
    <div className="form-group">
      <DatePicker {...input} 
        placeholder={_.upperCase('release date')}
        className="form-control input-cal"
        format="MMMM Do YYYY"
        yearRange={[1990, 2020]}
        value={new Date(input.value)}
        autocomplete="off"
        onChange={(_props) => {
          input.onChange(moment(_props).format());
        }}
        autoComplete="off" />
        {touched && error ? <div style={ { color: 'red', fontSize: '11px'} } >{error}</div> : null}
      </div>
  );
}

export const validate = (values) => {
  let errors = {};
  if(!values['releaseDate']) {
    errors['releaseDate'] = `Release Date is blank`;
  }
  return errors;
}

@reduxForm({
  form: 'release-form',
  validate
})

export default class Releaser extends Component  {
  tableHeadings = {
    'name': 'NAME',
    '_id': 'SKU#',
    'purchaseDate': 'PURCHASED',
    'price': 'PRICE',
    'onStock': 'ON STOCK',
    'quantiy': 'QUANTITY'
  }
  render() {
    let { props } = this;
    let { fetchProject, params: { alphanum }, submitSucceeded, reset, initializeProjectProductsRelease, closeReleaseModal, projects: { multiple, project: { products, items }, releaseStatus }, handleSubmit } = props;
    let count = _.size(products);
    if(multiple) {
      return(
        <div className="releaser">
          <div className="container">
            <div className="col-xs-12 col-sm-12 col-md-6 col-md-offset-3 col-lg-6 col-lg-offset-3">
              <div className="panel panel-default">
                <div className="panel-heading">
                  <span><i className="fa fa-envelope-o" aria-hidden="true"></i> Release Items
                  <a href="#" style={{float: 'right'}} onClick={(e) => {
                    e.preventDefault();
                    closeReleaseModal();
                    fetchProject(alphanum);
                    reset();
                  }}><span className="glyphicon glyphicon-remove"></span></a></span>
                </div>
                <div className="panel-body">
                  <div className="col-lg-12">
                    { !isUndefined(releaseStatus) ? <div className="alert alert-success">{releaseStatus.msg}</div> : null}
                    <form onSubmit={handleSubmit(values => {
                      initializeProjectProductsRelease(values);
                    })}>
                      <Field name="releaseDate" component={releaseDate} />
                      <div className="divider"></div>
                      <div className="table-response sorting-content">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>{count} ITEM{ count == 1 ? `` : `S` }</th>
                              {_.map(this.tableHeadings, (value, key) => {
                                return (
                                  <th key={key}>{value}</th>
                                )
                              })}
                            </tr>
                          </thead>
                          <Fields names={items} component={ManageReleaseField} products={products} />
                        </table>
                      </div>
                      <button className="btn btn-info btn-block" disabled={submitSucceeded}>Release</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return(
        <div className={`flashmessage text-center`}>
          <div className="close-wrap text-right clearfix">
            <a className="close" onClick={closeModal}>
              <span className="glyphicon glyphicon-remove"></span>
            </a>
          </div>
        </div>        
      );
    }
  }
}