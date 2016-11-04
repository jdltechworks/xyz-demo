import React, { Component } from 'react';
import { Link, RouterContext } from 'react-router';
import { ProjectAdd, ProjectController, ProductController , SearchBar } from './HeaderController';
import _ from 'lodash';


let isMobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);


export const historyBack = function(e) {
  e.preventDefault();
  window.history.back();
};

export class MenuToggle extends Component {
  setAppClass(e) {
    e.preventDefault();
    document.body.classList.toggle('menu-open');
  }  
  render() {
    return(
      <button type="button" className="menu-toggle" onClick={this.setAppClass.bind(this)}>
        <span className="menu-line"></span>
        <span className="menu-line"></span>
        <span className="menu-line"></span>
      </button>
    );
  }
}

export class ProductNavBar extends Component {
  render() {
    let { props } = this;
    let { products: { product } } = this.props;
    let title = () => {
      let _title = null;
      if(product) {
        if(_.isUndefined(product.name)) {
          _title = '';
        } else {
          _title = product.name;
        }  
      }
      return _title;
    }
    let serial = () => {
      let _serial = null;
      if(product) {
        if(_.isUndefined(product._id)) {
          _serial = null;
        } else {
          _serial = product._id;
        }  
      }
      return _serial;
    }
    if(_.isEmpty(product)){
      return(<header className="header logged-in">
        <div className="navbar navbar-default">
          <a href="#" className="back-btn" onClick={historyBack.bind(this)}></a>
          <div className="navbar-path">
            <span className="navbar-title">
              {`Loading...`}
            </span>
            </div>
          <div className="navbar-right">
            <ProductController {...props} />
          </div>
        </div>
      </header>);
    } else {
      return(
        <header className="header logged-in">
          <div className="navbar navbar-default">
            <a href="#" className="back-btn" onClick={historyBack.bind(this)}></a>
            <div className="navbar-path">
              <span className="navbar-title">
                {title()}
              </span>
              <span>
                {` : `}
              </span>
              <span className="">
                {serial()}
              </span>
              </div>
            <div className="navbar-right">
              <ProductController {...props} />
            </div>
          </div>
        </header>
      );
    }
  }
}

export class ProjectNavBar extends Component {
  render() {
    let { props } = this;
    let { projects: { project } } = this.props;
    let { 
      location: { pathname },
      params: { alphanum } 
    } = props;
    
    let title = () => {
      let _title = null;
      if(project) {
        if(_.isUndefined(project.name)) {
          _title = '';
        } else {
          _title = project.name;
        }  
      }
      return _title;
    }
    let serial = () => {
      let _serial = null;
      if(project) {
        if(_.isUndefined(project._id)) {
          _serial = null;
        } else {
          _serial = project._id;
        }  
      }
      return _serial;
    }
    if(_.isNaN(parseFloat(alphanum))) {
      let _locationArray = _.compact(pathname.replace(/\//g , ' ').split(' ')) || null;
      return(
        <header className="header logged-in">
          <div className="navbar navbar-default">
            {_.includes(pathname, 'second') ? <a href="#" className="back-btn" onClick={historyBack.bind(this)}></a> : <MenuToggle /> }
            <a href="#" className="navbar-brand"></a>
            <div className="navbar-path">
              <span className="navbar-title">
                {_locationArray[0]}
              </span>
              <span>
                {` : `}
              </span>
              <span className="">
                {_locationArray[1] ? _locationArray[1] : `all`}
              </span>
            </div>
            <div className="navbar-right">
              {_.indexOf([`archived`, `active`, `upcoming`, undefined], alphanum) == -1 ? <ProjectAdd {...props} /> : <SearchBar {...props} />}
            </div>
          </div>
        </header>
        );
      } else {
        if(_.isEmpty(project)){
          return(<header className="header logged-in">
            <div className="navbar navbar-default">
              <a href="#" className="back-btn" onClick={historyBack.bind(this)}></a>
              <div className="navbar-path">
                <span className="navbar-title">
                  {`Loading...`}
                </span>
                </div>
              <div className="navbar-right">
                <ProjectController {...props} />
              </div>
            </div>
          </header>);
        } else {
          return(
            <header className="header logged-in">
              <div className="navbar navbar-default">
                <a href="#" className="back-btn" onClick={historyBack.bind(this)}></a>
                <div className="navbar-path">
                  <span className="navbar-title">
                    {title()}
                  </span>
                  <span>
                    {` : `}
                  </span>
                  <span className="">
                    {serial()}
                  </span>
                  </div>
                <div className="navbar-right">
                  <ProjectController {...props} />
                </div>
              </div>
            </header>
          );
       }
     }
  }
}

export class LoginNavbar extends Component {
  render() {
    return(
      <header className="header logged-out">
        <div className="navbar navbar-default">
          <a href="#" className="navbar-brand"></a>
          <div className="navbar-right">
            <SearchBar />
          </div>
        </div>
      </header>    
    );
  }
}

export class DefaultNavBar extends Component {
  render() {
    let { props } = this;
    let { 
      params: { alphanum },
      location: { pathname }
    } = props;
    let _locationArray = _.compact(pathname.replace(/\//g , ' ').split(' ')) || null;
    if(_.eq(pathname, 'dashboard')) {
      return(
        <header className="header logged-in">
          <div className="navbar navbar-default">
            <MenuToggle />
            <a href="#" className="navbar-brand"></a>
            <div className="navbar-path">
              <span className="navbar-title">
                {_locationArray[0]}
              </span>
            </div>
            <div className="navbar-right">
              <SearchBar {...props} />
            </div>
          </div>
        </header>
      );    
    } else {
      return(
        <header className="header logged-in">
          <div className="navbar navbar-default">
            {!_.includes(pathname, 'share') ? <MenuToggle /> : <button type="button" className="menu-toggle"></button>}
            <a href="#" className="navbar-brand"></a>
            <div className="navbar-path">
              <span className="navbar-title">
                {_locationArray[0]}
              </span>
              <span>
                {` : `}
              </span>
              <span className="">
                {_locationArray[1] ? _locationArray[1] : `all`}
              </span>
            </div>
            <div className="navbar-right">
              <SearchBar {...props} />
            </div>
          </div>
        </header>
      );
    }

  }
}

export default class Header extends Component {
  render() {
    let { props } = this;
    let { 
      params: { alphanum },
      location: { pathname }
    } = props;
    
    let _locationArray = _.compact(pathname.replace(/\//g , ' ').split(' ')) || null;

    if(!_.isNaN(parseFloat(alphanum))) {
      if(_.includes(_locationArray, 'inventory')) {
        return(
          <ProductNavBar {...props} />
        );   
      }
    }

    if(_.includes(_locationArray, 'projects')) {
      return(
        <ProjectNavBar {...props} />
      );
    }

    if(_.eq(pathname, '/login')) {
      return(
        <LoginNavbar />
      );
    } else {
      return (
        <DefaultNavBar {...props}/>
      );      
    }
  }
}