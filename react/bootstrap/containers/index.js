import React, { Component } from 'react';
import Header from '../components/Header';
import Menu from '../components/Menu';
import { connect } from 'react-redux';
import { checkCredentials, LogOut } from '../actions/Auth';
import { fetchProduct, isDeletingProduct, isReleasingProduct } from '../actions/Product';
import { isReleasingProjectProducts, fetchNumOfProjects, isDeletingProject, isSelectingItems, initializePartialProjectUpdate } from '../actions/Project';
import { openSearch, closeSearch, initializeKeyWordSearch } from '../actions/Search';
import { openMailer } from '../actions/Mailer';
import { openPopUp, closePopUp } from '../actions/Message';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import SearchOverlay from '../components/SearchOverLay';


@connect(state => {
  return {
    auth: state.Auth,
    products: state.Products,
    projects: state.Projects,
    search: state.Search
  }
}, dispatch => bindActionCreators({ 
    LogOut, 
    checkCredentials, 
    isDeletingProduct,
    isReleasingProduct,
    openSearch,
    closeSearch,
    initializeKeyWordSearch,
    isSelectingItems,
    isDeletingProject,
    fetchNumOfProjects,
    openMailer,
    isReleasingProjectProducts
}, dispatch))

export default class App extends Component {
  componentWillMount() {
    let { auth: { isLoggedIn }, checkCredentials, fetchProducts, location: { pathname } } = this.props;
    checkCredentials(isLoggedIn);
  }
  render() {
    let { props } = this;
    let { auth: { isChecking, isLoggedIn },  search: { opened } } = props;
    if(isChecking) {
      return (
      <div className="wrapper container-fluid">
          <Header {...props}/>
      </div>);
    } else {
      return(
          <div className="wrapper container-fluid">
            <Header {...props}/>
              { isLoggedIn ? <Menu {...props}/> : null }
            <div className="row" style={ { position: 'relative' } }>
              {this.props.children}
              { opened ? <SearchOverlay {...props} /> : null }
            </div>
          </div>
      ); 
    }

  }
}