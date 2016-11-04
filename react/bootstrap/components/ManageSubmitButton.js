import React, { Component } from 'react';

export default class ManageSubmitButton extends Component {
  render() {
    let { props } = this;
    let { products: { collection, modal }, 
      AddProductsToProjects, 
      isDeletingProducts, 
      pristine, 
      submitting, 
      array, 
      reset, 
      formValues } = props;
    collection = _.flatten(collection);
    let allvalue = _.clone(collection);

    return(
      <div className="bottom-filter">
        <div className="container">
          <div className="row">
            <div className="col-sm-6">
              <div className="filter-left">
                <div className="valign">
                  <div className="valign-content">
                    <div className="filter-item">
                      <label className="control checkbox">
                      <input id="selectAll" type="checkbox" onClick={(e) => {
                        let { checked } = e.currentTarget;

                        let formElem = document
                          .querySelector('.table-response')
                          .getElementsByTagName('input');
                        let elems = _.omit(formElem, 'length');
                        if(checked) {
                          _.map(allvalue, (value, index) => {
                            let { key } = value;
                            array.push('products', key);
                          });
                        } else {
                          reset();
                        }
                      }}/>
                      <span className="control-indicator"></span>
                      SELECT ALL
                      </label>
                    </div>
                    <div className="filter-item">
                      <div className="items-selected">
                        <span className="badge">{!_.isUndefined(formValues) ? _.size(formValues.products) : 0}</span>ITEMS SELECTED
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="filter-left">
                <div className="valign">
                  <div className="valign-content">
                    <button disabled={pristine || submitting || _.size(formValues.products) == 0} onClick={(e) => {
                      if(!_.isUndefined(formValues)) {
                        let {products} = formValues;
                        if(_.gte(_.size(products), 1)) {
                          AddProductsToProjects(products);
                          //dispatch multiedit
                        }
                      }
                    }} className="btn btn-filter btn-dark"><span className="icon icon-add-2"></span>ADD TO...</button>
                    <button disabled={pristine || submitting || _.size(formValues.products) == 0} onClick={(e) => {
                      if(!_.isUndefined(formValues)) {
                        let {products} = formValues;
                        if(_.gte(_.size(products), 1)) {
                          isDeletingProducts(products);
                          //dispatch multidelete warning
                        }
                      }
                    }} className="btn btn-filter btn-dark"><span className="icon icon-delete"></span>DELETE</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}