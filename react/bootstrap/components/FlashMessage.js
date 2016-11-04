import moment from 'moment';
import Chance from 'chance';
import { Link } from 'react-router';
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { Field, Fields } from 'redux-form';
import DatePicker from 'react-pikaday-component';
import {renderReleaseDateField} from '../helpers';

export class FlashLoader extends Component {
  render() {
    return(
     <div className="loader">
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div>
    </div>
    );
  }
}

export class FlashSuccess extends Component {
  render() {
    let { props } = this;
    let { location: { pathname } } = props;
    if(_.includes(pathname, 'categories')) {
      let { message: { icon } } = props;
      return(
        <div className="check">
          <span className={icon}></span>
        </div>);
    }

    if(_.includes(pathname, 'user')) {
      let { users: {message: { icon } } } = props;
      return(
        <div className="check">
          <span className={icon}></span>
        </div>);
    }

    if(_.includes(pathname, 'inventory')) {
      let { products: { message: { icon } } } = props;
      return(
        <div className="check">
          <span className={icon}></span>
        </div>
      );   
    } else {
      let { projects: { message: { icon } } } = props;
      return(
        <div className="check">
        <span className={icon}></span>
      </div>
      );
    }
  }
}

/**
 * @todo  param handling for projects view, product view
 */

export class FlashMessageControls extends Component {
  render() {
    let { props } = this;
    let { location: { pathname }, dispatch, 
          reset, pristine, initialize } = props;
    let loc = _.compact(pathname.split('/'));

    if(_.includes(pathname, 'inventory')) {
      let { products: { isDeleting, isSubmitting, deleted, modal,
            message: { status, icon, details, link } } } = props;
      return(
        <div className="flashmessage-controls text-left">
          <ul>
            <li onClick={(e) => {
                dispatch({ type: 'CLOSE_MODAL'});
              }}>
              {link && !deleted ? 
              <Link to={link}>
                <span className="glyphicon glyphicon-eye-open"></span>
                <span> VIEW ITEM</span>
              </Link> : null
              }
            </li>
            <li>
              <Link to="/inventory/create" onClick={(e) => {
                if(_.includes(pathname, 'create')) {
                  let generator = new Chance();

                  let natural = generator.natural(
                  {
                    min: 0, 
                    max: 999999
                  });

                  initialize(
                    {'_id': natural,
                    'created_at': moment(new Date()).format()
                    }
                  );
                }
                dispatch({type: 'CLOSE_MODAL'});
              }}>
                <button onClick={reset}>
                  <span className="glyphicon glyphicon-plus"></span>
                  <span> ADD ANOTHER</span>
                </button>
              </Link>
            </li>
            <li>
              <Link to="/inventory/manage" onClick={(e) => {
                dispatch({type: 'CLOSE_MODAL'});
              }}>
                <span className="glyphicon glyphicon-cog"></span>
                <span> MANAGE INVENTORY</span>
              </Link>
            </li>
          </ul>
        </div>
      );    
    } else {
      let { resetImage, reset, closeModal,
            projects: { isDeleting, isSubmitting, modal,
            message: { status, icon, details, link } } } = props;
      return(
        <div className="flashmessage-controls text-left">
          <ul>
            <li>
              {_.includes(pathname, 'create') ? 
              <Link to={link} onClick={(e) => {
                dispatch({ type: 'CLOSE_MODAL'});
                if(resetImage) {
                  resetImage();
                }
                if(reset) {
                  reset();
                }
                if(closeModal) {
                  closeModal();
                }
              }}>
                <span className="glyphicon glyphicon-eye-open"></span>
                <span> VIEW PROJECT</span>
              </Link> : null
              }
            </li>
            <li>
              <Link to="/projects/create" onClick={(e) => {
                if(resetImage) {
                  resetImage()
                }
                if(reset) {
                  reset();
                }
                if(closeModal) {
                  closeModal();
                }
              }}>
                <button onClick={(e) => {
                  
                }}>
                  <span className="glyphicon glyphicon-plus"></span>
                  <span> ADD ANOTHER</span>
                </button>
              </Link>
            </li>
            <li>
              <Link to="/projects/active" onClick={(e) => {
                if(resetImage) {
                  resetImage()
                }
                if(reset) {
                  reset();
                }
                if(closeModal) {
                  closeModal();
                }
              }}>
                <span className="glyphicon glyphicon-cog"></span>
                <span> VIEW PROJECTS</span>
              </Link>
            </li>
          </ul>
        </div>
      );
    }
  }
}

export class DeleteWarning extends Component {
  render() {
    let { props } = this;
    let { location: { pathname } } = props;
    let loc = _.compact(pathname.split('/'));
    if(_.includes(loc, 'categories')) {
      let { name, toDelete, sorter, tags, initializeDelete, isSubmitting, closeModal } = props;
      let { key, tag } = toDelete;
      return(
        <div className="flashmessage text-center">
          <div className="close-wrap text-right clearfix">
            <a className="close" onClick={(e) => {
              closeModal();
            }}>
              <span className="glyphicon glyphicon-remove"></span>
            </a>
          </div>
            <h2>Are you sure you want to delete {tag}</h2>
          <br />
          <div className="btn-list">
            <a href="#" className="btn btn-filter" onClick={(e) => {
              initializeDelete(toDelete);
              sorter(_.compact(tags));
            }}>Okay</a>
            <a href="#" className="btn btn-filter btn-dark" onClick={(e) => {
              closeModal();
            }}>Cancel</a>
          </div>
          <br />
          <p>{`Action can no longer be undone`}</p>
        </div>
      );
    }
    if(_.includes(pathname, 'user')) {
      let { initializeDeleteUser, users : { isSubmitting, userDetails: { user, credentials} } } = props;
      let { users } = props;

      let { closeModal} = props;
      return(
        <div className="flashmessage text-center">
          <div className="close-wrap text-right clearfix">
            <a className="close" onClick={(e) => {
              e.preventDefault();
              closeModal();
            }}>
              <span className="glyphicon glyphicon-remove"></span>
            </a>
          </div>
            <h2>Are you sure you want to delete</h2>
          <br />
          <div className="btn-list">
            <a href="#" className="btn btn-filter" onClick={(e) => {
              e.preventDefault();
              initializeDeleteUser({ user, credentials });
            }}>Okay</a>
            <a href="#" className="btn btn-filter btn-dark" onClick={(e) => {
              closeModal();
            }}>Cancel</a>
          </div>
          <br />
          <p>{`Action can no longer be undone`}</p>
        </div>);
    }
    if(_.includes(pathname, 'inventory')){
      let { products: { isNote } } = props;
      if (isNote) {
        let { products: { noteKey }, initializeDeleteNote, dispatch } = props;
        return(
          <div className="flashmessage text-center">
            <div className="close-wrap text-right clearfix">
              <a className="close" onClick={(e) => {
                if (dispatch) {
                  dispatch({type: 'CLOSE_MODAL'});
                }
              }}>
                <span className="glyphicon glyphicon-remove"></span>
              </a>
            </div>
              <h2>Are you sure you want to delete this note?</h2>
            <br />
            <div className="btn-list">
              <a href="#" className="btn btn-filter" onClick={(e) => {
                initializeDeleteNote(noteKey);
              }}>Okay</a>
              <a href="javascript:;" className="btn btn-filter btn-dark" onClick={(e) => {
                dispatch({type: 'CLOSE_MODAL'});
              }}>Cancel</a>
            </div>
            <br />
            <p>{`Action can no longer be undone`}</p>
          </div>
        );
      } else {
        let { dispatch,
              deleteProduct, 
              closeProductModal,
              params: { alphanum },
              products: { product, productDetails },
              reset
            } = props;
        let { name, _id } = product;
        return(
          <div className="flashmessage text-center">
            <div className="close-wrap text-right clearfix">
              <a className="close" onClick={(e) => {
                if(dispatch) {
                  dispatch({type: 'CLOSE_MODAL'});
                } else {
                  closeProductModal();
                }
                reset();
                if(_.includes(loc, 'manage')) {
                  document.getElementById('selectAll').checked = false;
                }
              }}>
                <span className="glyphicon glyphicon-remove"></span>
              </a>
            </div>
            {productDetails ?
              <div>
              <h2>Are you sure you want to delete these items ?</h2>
              <ul className="text-left" style={{marginLeft: '0', listStyle: 'none'}}>
              {_.map(productDetails, (product, key) => {
                let { name, _id } = product;
                return(
                  <li style={{ fontSize: '14px'}} key={key}>{name}</li>
                );
              })}
              </ul>
              </div>
              :
              <h2>Are you sure you want to delete {name}</h2>
            }
            
            <br />
            <div className="btn-list">
              <a href="#" className="btn btn-filter" onClick={(e) => {
                if(_.includes(loc, 'manage')) {
                  if(productDetails) {
                    deleteProduct(productDetails);
                  } else {
                    deleteProduct(product);
                  }
                  
                } else {
                  deleteProduct(product);
                }
              }}>Okay</a>
              <a href="#" className="btn btn-filter btn-dark" onClick={(e) => {
                if(dispatch) {
                  dispatch({ type: 'CLOSE_MODAL'});
                } else {
                  closeProductModal();
                }
              }}>Cancel</a>
            </div>
            <br />
            <p>{`Action can no longer be undone`}</p>
          </div>
        );
      }
    } else {
        if(_.includes(pathname, 'projects')) {
          let { props } = this; 
          let { initializeProjectDelete, initializeProductRemove, closeModal, projects: { project, projectKey, isDeletingProject, isDeletingProduct, productKey } } = props;
          let { name } = project;
          return(
            <div className="flashmessage text-center">
              <div className="close-wrap text-right clearfix">
                <a className="close" onClick={(e) => {
                  e.preventDefault();
                  closeModal();
                }}>
                  <span className="glyphicon glyphicon-remove"></span>
                </a>
              </div>
                <h2>Are you sure you want to add {name} to archive?</h2>
              <br />
              <div className="btn-list">
                <a href="#" className="btn btn-filter" onClick={(e) => {
                  e.preventDefault();
                  if(isDeletingProject) {
                    initializeProjectDelete({ project, projectKey});
                  } else {
                    initializeProductRemove({ project, productKey});
                  }
                }}>Okay</a>
                <a href="#" className="btn btn-filter btn-dark" onClick={(e) => {
                  closeModal();
                }}>Cancel</a>
              </div>
              <br />
              <p>{`Action can no longer be undone`}</p>
            </div>);
        }
    }
  }
}

export class ReleaseProduct extends Component {
  componentDidMount() {
    let { props } = this;
  }
  render() {
    let { props } = this;
    let {
      handleSubmit, pristine, reset, submitting, releaseProduct, dispatch, closeModal,
      products: {
        product
      }
    } = props;
    return (
      <div className="flashmessage text-center">
        <div className="close-wrap text-right clearfix">
          <a className="close" onClick={(e) => {
            if(dispatch) {
              dispatch({type: 'CLOSE_MODAL'});
            }
          }}>
            <span className="glyphicon glyphicon-remove"></span>
          </a>
        </div>
          <h2>Please fill up the release form.</h2>
        <br />
        <form className="container" onSubmit={handleSubmit((props) => {
          if (dispatch) {
            props.product = product;
            releaseProduct(props);
            
            
          }
        })}>
        <Fields names={['releaseDate', 'quantity']} component={renderReleaseDateField} {...props} />
        <br />
        <div className="btn-list">
          <button disabled={submitting} className="btn btn-filter">Release</button>
          <a href="#" className="btn btn-filter btn-dark" onClick={(e) => {
            if(dispatch) {
              dispatch({type: 'CLOSE_MODAL'});
            }
          }}>Cancel</a>
        </div>
        </form>
        <br />
      </div>
    );
  }
}

export class AddToProject extends Component {
  componentDidMount() {
    let { props } = this;
    let { fetchProjectsSelection } = props;
    fetchProjectsSelection();
  }
  render() {
    let { props } = this;
    let { closeProductModal, 
          dispatch, 
          reset, 
          handleSubmit,
          initializeAddtoProject,
          pristine,
          submitting,
          products: { hasOneProduct, options, productDetails, isFecthingOptions }
        } = props;
    if(hasOneProduct) {
      return(
        <div></div>
      );
    } else {
    return(
      <div className={`flashmessage text-center`}>
        <div className="close-wrap text-right clearfix">
          <button onClick={reset}>
            <a className="close" onClick={(e) => {
              if(dispatch) {
                dispatch({type: 'CLOSE_MODAL'});
              } else {
                closeProductModal();
              }
              document.getElementById('selectAll').checked = false;
            }}>
              <span className="glyphicon glyphicon-remove"></span>
            </a>
          </button>
        </div>
        <div className="container">
          <div className="col-md-12">
            <form>
              <div className="form-group">
                <label className="form-label">Choose a project were you want to add these items</label>
                <br />
                <br />
                {isFecthingOptions ? <p>Please wait...</p> 
                    : 
                  <Field name="project" component="select" className="form-control" style={{padding: '12px', height: 'auto'}}>
                    <option>Select project</option>
                    {_.map(options, (value, index) => {
                      let { name, key } = value;
                      return( 
                        <option key={index} value={key}>{name}</option>
                      );
                    })}
                </Field>}
              </div>
              <div className="btn-list">
                <button className="btn btn-filter" disabled={ pristine || submitting } onClick={handleSubmit(data => {
                  initializeAddtoProject(data);
                })}>Okay</button>&nbsp;
                <a className="btn btn-filter" onClick={(e) => {
                  e.preventDefault()
                  if(dispatch) {
                    dispatch({type: 'CLOSE_MODAL'});
                  } else {
                    closeProductModal();
                  }
                  reset();
                  document.getElementById('selectAll').checked = false;
                }}>Cancel</a>
              </div>
              <br />
              <br />
            </form>
          </div>
        </div>
      </div>
    );
  }
  }
}

export class Message extends Component {
  render() {
    let { props } = this;
    let { dispatch, 
          location: { pathname }, 
          params: { alphanum } , 
          reset, 
          pristine,
          initialize } = props;
    let loc = _.compact(pathname.split('/'));
    
    if(_.includes(pathname, 'categories')) {
      let { isSubmitting, tags, message: { status, details }, closeModal } = props;
      return(
        <div className={`flashmessage text-center`}>
          <div className="close-wrap text-right clearfix">
            <button>
              <a className="close" onClick={(e) => {
                closeModal();
              }}>
                <span className="glyphicon glyphicon-remove"></span>
              </a>
           </button>
          </div>
          <h3>{status}</h3>
          <p>{details}</p>
          
          {isSubmitting ? <FlashLoader /> : <FlashSuccess {...props} />}
        </div>
      );
    }

    if(_.includes(pathname, 'user')) {
        let { users : {isSubmitting,  message: { status, message, icon } } } = props;
        let { users } = props;
        let { closeModal} = props;
        return(
          <div className={status == 'FAILED' ? `flashmessage text-center error`: `flashmessage text-center`}>
            <div className="close-wrap text-right clearfix">
              <button>
                <a className="close" onClick={(e) => {
                  closeModal();
                }}>
                  <span className="fa fa-times"></span>
                </a>
             </button>
            </div>
            <h3>{status}</h3>
            <p>{message}</p>
              {isSubmitting ? <FlashLoader /> : <FlashSuccess {...props} />}
          </div>
        );
    }


    if(_.includes(pathname, 'inventory')) {
      let { closeProductModal,
            reset,
            params: { alphanum },
            products: { isDeleting, isSubmitting, modal, message: { status, icon, details, link } },
          } = props;
      return(
          <div className={`flashmessage text-center`}>
            <div className="close-wrap text-right clearfix">
              <button onClick={reset}>
                <a className="close" onClick={(e) => {
                  if(_.includes(loc, 'edit')) {
                    setTimeout(() => { browserHistory.push(link); }, 1000)
                  }
                  if(_.includes(pathname, 'create')) {
                    let generator = new Chance();

                    let natural = generator.natural(
                    {
                      min: 0, 
                      max: 999999
                    });

                    initialize(
                      {
                        _id: natural,
                        created_at: moment(new Date()).format(),
                        usage: 0 
                      }
                    );
                    reset();
                  }
                  if(dispatch) {
                    dispatch({type: 'CLOSE_MODAL'});
                  } else {
                    if(reset) {
                      reset();
                    }
                    closeProductModal();
                  }
                  if(_.includes(loc, 'manage')) {
                    document.getElementById('selectAll').checked = false;
                  }

                }}>
                  <span className="glyphicon glyphicon-remove"></span>
                </a>
             </button>
           </div>
            <h3>{status}</h3>
            {isSubmitting ? <FlashLoader /> : <FlashSuccess {...props} />}
            <p>{details}</p>
            {isSubmitting ? null : <FlashMessageControls {...props} />}
          </div>
        );
    } else {
        let { reset, closeModal, resetImage, 
              projects: { isDeleting, isDeletingProduct, isSubmitting, modal, 
                message: { status, icon, details, link } } } = props;
        return(
          <div className={`flashmessage text-center`}>
            <div className="close-wrap text-right clearfix">
              <button onClick={reset}>
                <a className="close" onClick={(e) => {
                  if(_.includes(pathname, 'edit')) {
                    setTimeout(() => { browserHistory.push(link); }, 1000)
                  } else {
                    if(isDeletingProduct) {
                      browserHistory.push('/projects/create');
                    }
                  }
                  if(reset) {
                    reset();
                  }
                  if(resetImage) {
                    resetImage();
                  }
                  closeModal();
                }}>
                  <span className="glyphicon glyphicon-remove"></span>
                </a>
             </button>
           </div>

            <h3>{status}</h3>
            {isSubmitting ? <FlashLoader /> : <FlashSuccess {...props}/>}
            <p>{details}</p>
            {isSubmitting ? null : <FlashMessageControls {...props} />}
          </div>
        );
    }

  }
}

//<Message {...props}/>
export default class FlashMessage extends Component {
  render() {
    let { props } = this;
    let { location: { pathname } } = props;

    if(_.includes(pathname, 'categories')) {
      let { isDeleting } = props;
      return(
        <div className={`overlay open`}>
          {isDeleting ? <DeleteWarning {...props} /> : <Message {...props} />}
        </div>
      );
    }
    if(_.includes(pathname, 'inventory')) {
      let { products: { isDeleting, isUpdate, isUpdating, isRelease, isReleasing }} = props;
      if (isRelease) {
        return (
          <div className={`overlay open`}>
            {isReleasing ? <ReleaseProduct {...props} /> : <Message {...props} />}
          </div>
        );
      }
      if(!isUpdate) {
        return (
          <div className={`overlay open`}>
            {isDeleting ? <DeleteWarning {...props} /> : <Message {...props} />}
          </div>
        );
      } else {
        let { products } = props;
        return (
          <div className={`overlay open`}>
            {!isUpdating ? <AddToProject {...props} /> : <Message {...props} />}
          </div>
        );
      }
    } else if (_.includes(pathname, 'users')) {
       let { users: { isDeleting } } = props;
        return (
          <div className={`overlay open`}>
            {isDeleting ? <DeleteWarning {...props} /> : <Message {...props} />}
          </div>
        );
    } else {
      let { projects: { isDeleting, isUpdate, isUpdating, isRelease, isReleasing, multiple }} = props;

      if(!isRelease) {
        return (
          <div className={`overlay open`}>
            {isDeleting ? <DeleteWarning {...props} /> : <Message {...props} />}
          </div>
        );
      } else {
        return(<div className={`overlay open`}><ReleaseWarning {...props} /></div>);
      }
    }
  }
}