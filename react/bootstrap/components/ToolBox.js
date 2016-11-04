import React, { Component } from 'react';
import { Field } from 'redux-form';
import moment from 'moment';
import _ from 'lodash';


export class ProductToolBox extends Component {
  state = {
    isAdd: false
  };
  render() {
    let { setState, state: { isAdd }, props } = this;
    let { handleSubmit, pristine, submitting, reset, addProductToProject, suggestProductToProject, dispatch,
          products: { options, isFecthingOptions, product: { projects,  deleted_at } }, auth: { credentials } } = props;
    let projectsInProduct = _.keys(projects);
    if(!deleted_at) {
      return(
        <div className="tools-wrap tool-panel">
          <div className="tool-controls">
            <div className="tool-btns" onClick={(e) =>{
                let { currentTarget: {
                      parentNode: { parentNode } } } = e;
                this.setState({ isAdd: false });
                parentNode.classList.add('active');
              }}>
              <span className="tool-btn">
                <em className="icon icon-favorites"></em>
              </span> 
            </div>
            <div className="tool-btns" onClick={(e) => {
                let { currentTarget: { 
                      parentNode: { parentNode } } } = e;
                this.setState({ isAdd: true });
                parentNode.classList.add('active');
              }}>
              <span className="tool-btn add-btn">
                <em className="icon icon-add"></em>
              </span> 
            </div>
          </div>
          <div className="tool-panel-content">
            <div className="content-inner">
              <h4>{`${isAdd ? `ADD `: `SUGGEST`
              } TO PROJECT`}</h4>
              <form onSubmit={handleSubmit((props) => {
                if (isAdd) {
                  addProductToProject(props);
                } else {
                  props.credentials = credentials;
                  suggestProductToProject(props);
                }
                document.querySelector('.tool-panel').classList.remove('active');
                reset();

              })}>
                <div className="select-form">
                  <Field name="item" component="hidden" />    
                  <Field name="project" component="select">
                    {_.map(options, (value, index) => {
                        let { name, key } = value;
                        if(!_.includes(projectsInProduct, key)) {
                          return( 
                            <option key={index} value={key}>{name}</option>
                          );
                        }
                    })}
                  </Field>
                </div>
                <button disabled={pristine || submitting } className={
                  `btn btn-block ${ isAdd ? `btn-success` : `btn-warning` }`
                }>
                <span className={
                  `${isAdd ? `icon-add` : `icon-favorites`}`
                }></span>{`${isAdd ? `ADD` : `SUGGEST`}`}</button>
              </form>
            </div>
          </div>
        </div>
      );
    } else {
      return(
        <div className="tools-wrap tool-panel">
        </div>
      );
    }
  }
}

export default class ProductsToolBox extends Component {
  componentDidMount() {
    let { props } = this;
    let { fetchProjectsSelection, initialize, _product: { key } } = props;

    fetchProjectsSelection();
    initialize({ key });
  }
  render() {
    let { props } = this;
    let { handleSubmit, products: { options }, _product, addProductToProject, reset } = props;
    let { projects, status, name } = _product;
    let projectsInProduct = _.keys(projects);
    if(_.eq(status, 'AVAILABLE')) {
       return(
        <div className="tools-wrap tool-panel">
          <div className="checkout-location-btn">
            <div className="tool-btns">
              
              <span className="tool-btn add-btn" onClick={(e) => {
                let { currentTarget: { parentNode: { parentNode: { parentNode } } }, firstChild } = e;
                let icon = e.currentTarget.getElementsByTagName('em');
                icon[0].classList.toggle('icon-remove');
                parentNode.classList.toggle('active');
              }}>
                <em className="icon icon-add"></em>
              </span>
            </div>
          </div>
          <div className="tool-panel-content" onMouseLeave={(e) => {
            let { currentTarget: { parentNode } } = e;
            parentNode.classList.remove('active');
            let icon = parentNode.getElementsByTagName('em');
            icon[0].classList.toggle('icon-remove');
            reset();
          }}>
            <div className="content-inner">
              <form onSubmit={handleSubmit((props) => {
                addProductToProject(props);
              })}>
                <h4>ADD TO PROJECT</h4>
                <div className="select-form">
                  <Field name="project" component="select">
                    <option value={`-`}>SELECT A PROJECT</option>
                    {!_.isEmpty(options) ?  _.map(options, (value, index) => {
                      let { key, name } = value;
                      if(!_.includes(projectsInProduct, key)) {
                        return (<option key={index} value={key}>{_.upperCase(name)}</option>)
                      }
                    }): null}
                  </Field>
              </div>
              <button className="btn btn-success btn-block"><span className="icon icon-check"></span>SAVE</button>
              </form>
            </div>
          </div>
        </div>
      );     
    } else {
      if(_.eq(status, 'IN_LOCATION')) {
        let { project: { startDate, endDate, street, suburb } } = _product;
        return(
          <div className="tools-wrap tool-panel">
            <div className="checkout-location-btn">
              <div className="tool-btns">
                <span className="tool-btn location-btn btn-to-hide" onClick={(e) => {
                  e.preventDefault();
                  let { currentTarget: { parentNode: { parentNode } } } = e;
                  parentNode.classList.toggle('active');
                }}>
                  <em className="icon icon-location"></em>
                </span>
                <span className="tool-btn add-btn" onClick={(e) => {
                  let { currentTarget: { parentNode: { parentNode: { parentNode } } } } = e;
                  let icon = e.currentTarget.getElementsByTagName('em');
                  icon[0].classList.toggle('icon-remove');
                  parentNode.classList.toggle('active');

                }}>
                  <em className="icon icon-add"></em>
                </span>
              </div>
              <ul className="tool-tap">
                  <li><em className="icon icon-lock"></em>{moment(new Date(startDate)).format('MM.DD')} - {moment(new Date(endDate)).format('MM.DD')}</li>
                  <li><em className="icon icon-location"></em>{_.upperCase(`${street} ${suburb}`)}</li>
              </ul>
            </div>
            <div className="tool-panel-content" onMouseLeave={(e) => {
                let { currentTarget: { parentNode } } = e;
                parentNode.classList.remove('active');
                let icon = parentNode.getElementsByTagName('em');
                icon[1].classList.remove('icon-remove');
                reset();
              }}>
              <div className="content-inner">
                <form onSubmit={handleSubmit((props) => {
                  addProductToProject(props);
                })}>
                  <h4>ADD TO PROJECT</h4>
                  <div className="select-form">
                    <Field name="project" component="select">
                      <option value={`-`}>SELECT A PROJECT</option>
                      {!_.isEmpty(options) ?  _.map(options, (value, index) => {
                        let { key, name } = value;
                        if(!_.includes(projectsInProduct, key)) {
                          return (<option key={index} value={key}>{_.upperCase(name)}</option>)
                        }
                      }): null}
                    </Field>
                </div>
                <button className="btn btn-success btn-block"><span className="icon icon-check"></span>SAVE</button>
                </form>
              </div>
            </div>
          </div>
        );
      }
      if(_.eq(status, 'ARCHIVED')) {
        return(
          <div className="tools-wrap tool-panel active">
          </div>      
        );
      }
      if(_.eq(status, 'CHECKED_OUT')){
        let { project: { startDate, endDate, street, suburb } } = _product;
        return(
          <div className="tools-wrap tool-panel">
            <div className="checkout-location-btn">
              <div className="tool-btns">
                <span className="tool-btn lock-btn btn-to-hide" onClick={(e) => {
                  e.preventDefault();
                  let { currentTarget: { parentNode: { parentNode } } } = e;
                  parentNode.classList.toggle('active');
                }}>
                  <em className="icon icon-lock"></em>
                </span>
                <span className="tool-btn add-btn" onClick={(e) => {
                  let { currentTarget: { parentNode: { parentNode: { parentNode } } } } = e;
                  let icon = e.currentTarget.getElementsByTagName('em');
                  icon[0].classList.toggle('icon-remove');
                  parentNode.classList.toggle('active');
                }}>
                  <em className="icon icon-add"></em>
                </span>
              </div>
              <ul className="tool-tap">
                  <li><em className="icon icon-lock"></em>{moment(new Date(startDate)).format('MM.DD')} - {moment(new Date(endDate)).format('MM.DD')}</li>
                  <li><em className="icon icon-location"></em>{_.upperCase(`${street} ${suburb}`)}</li>
              </ul>
            </div>
            <div className="tool-panel-content" onMouseLeave={(e) => {
              let { currentTarget: { parentNode } } = e;
              parentNode.classList.remove('active');
              let icon = parentNode.getElementsByTagName('em');
              icon[1].classList.remove('icon-remove');
              reset();
            }}>

              <div className="content-inner">
                <form onSubmit={handleSubmit((props) => {
                  addProductToProject(props);
                })}>
                  <h4>ADD TO PROJECT</h4>
                  <div className="select-form">
                    <Field name="project" component="select">
                      <option value={`-`}>SELECT A PROJECT</option>
                      {!_.isEmpty(options) ?  _.map(options, (value, index) => {
                        let { key, name } = value;
                        if(!_.includes(projectsInProduct, key)) {
                          return (<option key={index} value={key}>{_.upperCase(name)}</option>)
                        }
                      }): null}
                    </Field>
                </div>
                <button className="btn btn-success btn-block"><span className="icon icon-check"></span>SAVE</button>
                </form>
              </div>
            </div>
          </div>
        );
     } else {
       return(
        <div className="tools-wrap tool-panel">
          <div className="checkout-location-btn">
            <div className="tool-btns">
              
              <span className="tool-btn add-btn" onClick={(e) => {
                let { currentTarget: { parentNode: { parentNode: { parentNode } } } } = e;
                let icon = e.currentTarget.getElementsByTagName('em');
                icon[0].classList.toggle('icon-remove');
                parentNode.classList.toggle('active');
              }}>
                <em className="icon icon-add"></em>
              </span>
            </div>
          </div>
          <div className="tool-panel-content" onMouseLeave={(e) => {
            let { currentTarget: { parentNode } } = e;
            parentNode.classList.remove('active');
            let icon = parentNode.getElementsByTagName('em');
            icon[0].classList.remove('icon-remove');
            reset();
          }}>
            <div className="content-inner">
              <form onSubmit={handleSubmit((props) => {
                addProductToProject(props);
              })}>
                <h4>ADD TO PROJECT</h4>
                <div className="select-form">
                  <Field name="project" component="select">
                    <option value={`-`}>SELECT A PROJECT</option>
                    {!_.isEmpty(options) ?  _.map(options, (value, index) => {
                      let { key, name } = value;
                      if(!_.includes(projectsInProduct, key)) {
                        return (<option key={index} value={key}>{_.upperCase(name)}</option>)
                      }
                    }): null}
                  </Field>
              </div>
              <button className="btn btn-success btn-block"><span className="icon icon-check"></span>SAVE</button>
              </form>
            </div>
          </div>
        </div>
      );    
     }
    }
  }
}