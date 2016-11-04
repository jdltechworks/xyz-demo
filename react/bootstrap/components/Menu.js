import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

export default class Menu extends Component {
  componentDidMount() {
    let { props } = this;
    let { fetchNumOfProjects, auth: { isLoggedIn } } = props;
    setTimeout(() => fetchNumOfProjects(), 1500);
  }
  render() {
    let { props } = this;
    let { LogOut, projects: { badgeCount, collection } } = props;
    return(
      <div className="menu-panel">
        <div className="menu-container" onClick={(e)=> {
          document.body.classList.remove('menu-open');
        }}>
          <div className="menu-content">
            <h3><span className="icon icon-inventory icon-fw"></span>inventory</h3>
            <ul className="menu">
              <li><Link to="/inventory">BROWSE ALL</Link></li>
              <li><Link to="/inventory/search">SEARCH ITEMS</Link></li>
              <li><Link to="/inventory/archived">ARCHIVED</Link></li>
              <li><Link to="/inventory/available">AVAILABLE</Link></li>
              <li><Link to="/inventory/checkedout">CHECKED OUT</Link></li>
            </ul>
          </div>
          <div className="menu-content">
            <h3><span className="icon icon-projects icon-fw"></span>projects</h3>
            <ul className="menu">
              <li><Link to="/projects/create">ADD NEW PROJECT</Link></li>
              <li><Link to="/projects">BROWSE ALL</Link></li>
              <li>
                <Link to="/projects/active">ACTIVE PROJECTS
                <span className="badge">
                  {badgeCount}
                </span>
                </Link>
              </li>
              <li><Link to="/projects/upcoming">UPCOMING</Link></li>
              <li><Link to="/projects/archived">ARCHIVED</Link></li>
            </ul>
          </div>
          <div className="menu-content">
            <h3><span className="icon icon-admin icon-fw"></span>admin</h3>
            <ul className="menu">
              <li><Link to="/dashboard">DASHBOARD</Link></li>
              <li><Link to="/inventory/create">ADD NEW ITEM</Link></li>
              <li><Link to="/inventory/manage">MANAGE INVENTORY</Link></li>
              <li><Link to="/inventory/categories">MANAGE CATEGORIES</Link></li>
              <li><a href="#" onClick={(e) => {
                e.preventDefault();
                document.body.classList.remove('menu-open');
                LogOut();
              }}>LOGOUT</a></li>
            </ul>
          </div>
          <div className="menu-content">
            <h3><span className="icon icon-user icon-fw"></span>users</h3>
            <ul className="menu">
              <li><Link to="/users">MANAGE USERS</Link></li>
              <li><Link to="/users/create">ADD NEW USERS</Link></li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}