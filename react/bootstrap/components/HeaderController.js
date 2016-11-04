import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import { Field } from 'redux-form';
import SearchBox from './SearchBox';
import _jq from 'jquery';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';


export const closeDropDown = (e) => {
  e.preventDefault();
  e.currentTarget.parentNode.style.display = 'none';
}

export class ProjectController extends Component {
  state = {
    close: true
  };
  render() {
    let { props, state: { close } } = this;
    let { isReleasingProjectProducts, openMailer, isDeletingProject, isSelectingItems, initializePartialProjectUpdate, params: { alphanum }, projects: { project: { endDate, deleted_at }, project } } = props;
    if(project) {
      if(deleted_at) {
        return(
          <div>
          </div>
        );
      } else {
        return(
          <div className="filter-dropdown dropdown">
            <a href="#" className={`dropdown-btn ${!close ? `active` : ``}`} onClick={(e) => {
              e.preventDefault();
              this.setState({ close: !this.state.close })
            }}><span className="icon icon-setting"></span>MANAGE PROJECT</a>
              <ReactCSSTransitionGroup
                component="div"
                className="dropdown-container"
                transitionName="dropdown"
                transitionEnterTimeout={200}
                transitionAppearTimeout={100}
                transitionLeaveTimeout={100}
                transitionAppear={true}
              >
              {!close ?
              <ul key="key" className="dropdown-content">
                <li onClick={(e) => {
                    this.setState({ close: !this.state.close });
                    isSelectingItems();
                  }}>
                  <Link to={`/projects/${alphanum}/edit/second`}>
                    <span className="icon icon-add icon-fw"></span>
                    ADD MORE ITEMS
                  </Link>
                </li>
                <li onClick={(e) => {
                    this.setState({ close: !this.state.close });
                  }}>
                  <Link to={`/projects/${alphanum}/edit`}>
                    <span className="icon icon-edit icon-fw"></span>
                    EDIT DETAILS
                  </Link>
                </li>
                <li>
                  <a href="#" onClick={(e) => {
                    e.preventDefault();
                    isReleasingProjectProducts(project);
                    this.setState({ close: !this.state.close });
                  }}>
                    <span className="icon icon-remove icon-fw"></span>RELEASE ITEMS</a>
                </li>
                <li>
                  <a href="#" onClick={(e) => {
                    e.preventDefault();
                    isDeletingProject(alphanum);
                    this.setState({ close: !this.state.close });
                  }}><span className="icon icon-fw fa fa-clock-o"></span>
                    ARCHIVE PROJECT
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => {
                    e.preventDefault();
                    this.setState({ close: !this.state.close });
                    openMailer();
                  }}><span className="icon icon-email icon-fw"></span>
                  EMAIL PROJECT
                  </a>
                </li>
              </ul>
              : null}
              </ReactCSSTransitionGroup>
          </div>
        );
      }
    } else {
      return(
        <div className="filter-dropdown dropdown text-center" disabled={true}>
        </div>
      );      
    }

  }
}

export class ProductController extends Component {
  state = {
    close: true
  };
  componentDidUpdate() {
    let elems = document.querySelectorAll('ul.dropdown-content li');
      _.map(elems, (li, key) => {
        li.addEventListener('click', function(e) {
          let { parentNode } = e.currentTarget;
          parentNode.style.display = 'none';
        });
      });
  }
  render() {
    let { props, state: { close } } = this;
    let { params: { alphanum }, isDeletingProduct, isReleasingProduct, openMailer } = props;
    let { products: { product } } = props;
    if(!_.isEmpty(product) || _.gt(_.size(product), 0)) {
     let { deleted_at, key } = product;
     if( _.isUndefined(deleted_at) ) {
      return(        
        <div className="filter-dropdown dropdown">
          <a href="#" className={`dropdown-btn ${!close ? `active` : ``}`} onClick={(e) => {
            e.preventDefault();
            this.setState({ close: !this.state.close })
          }}><span className="icon icon-setting"></span>MANAGE ITEM</a>
          <ReactCSSTransitionGroup
            component="div"
            className="dropdown-container"
            transitionName="dropdown"
            transitionEnterTimeout={200}
            transitionAppearTimeout={100}
            transitionLeaveTimeout={100}
            transitionAppear={true}
          >
          {!close ?
          <ul key="key" className="dropdown-content">
            <li>
              <a href="#" onClick={(e) => { isReleasingProduct({ key }); }}>
                <span className="icon icon-remove icon-fw"></span>RELEASE ITEM
              </a>
            </li>

            <li>
              <Link to={`/inventory/${alphanum}/edit`}>
                <span className="icon icon-edit icon-fw"></span>EDIT DETAILS
              </Link>
            </li>
            <li>
              <a href="#" onClick={(e) => {
              isDeletingProduct({ key });
              }}><span className="icon icon-delete icon-fw"></span>DELETE ITEM</a>
            </li>
            <li>
              <a href="#" onClick={(e) => {
                e.preventDefault();
                this.setState({ close: !this.state.close });
                openMailer();
              }}><span className="icon icon-email icon-fw"></span>
              EMAIL ITEM
              </a>
            </li>
          </ul> : null}
          </ReactCSSTransitionGroup>
        </div>);
    } else {
      return(
        <div className="filter-dropdown dropdown text-center">
          <a href="#" className="dropdown-btn"><span className="icon icon-lock"></span>ARCHIVED</a>
        </div>
      );

    }
   } else {
    return <div></div>
   }
  }
}



export class ProjectAdd extends Component {
  submitProject(e) {
    e.preventDefault();
  }
  render() {
    let { location: { pathname } } = this.props;
    return(
      <div className="navbar-right">
        <div className="valign">
          <div className="valign-content">
            <div className="navbar-item">
              <ul className="steps">
                <li className={_.eq(pathname, '/projects/create') ? 'active': null}><a href="#" onClick={(e) => {
                  e.preventDefault();
                }}>01</a></li>
                <li className={_.includes(pathname, 'second') ? 'active': null}>
                  <a href="#">02</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}



export class SearchBar extends Component {
  render() {
    let { props } = this;
    let { props: { auth } } = this;
    if(auth) {
      let { isLoggedIn } = auth;
       return(
        <SearchBox {...props} />
      );
    } else {
      return(
        <div></div>
      );
    }
  }
}