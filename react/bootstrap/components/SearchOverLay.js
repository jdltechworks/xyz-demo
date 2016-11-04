import React, { Component } from 'react';
import { Link } from 'react-router';

export default class SearchOverlay extends Component {
  render() {
    let { props } = this;
    let { closeSearch, search: { result }, products: { searchResults }, projects: { searchResults: projectResults } } = props;
    return(
      <div className="search-overlay">
        <div className="wrap">
          <div className="search-control text-right">
            <a href="#" className="search-close" onClick={closeSearch}>
              <span className="glyphicon glyphicon-remove"></span>
            </a>
          </div>
          <div className="container">
            <h2>You are searching for: { result }</h2>
            <h3>PRODUCTS</h3>
            {_.isEmpty(searchResults) ? <div className="result">Didn't find anything</div> :
              <div>
                {_.map(searchResults, (product) => {
                  var { name, _id } = product;

                  return <Link key={_id} className="result" to={`/inventory/${_id}`} onClick={closeSearch}>{_id + ` - ` + name}</Link>
                })}
              </div>
            }
            <br/>
            <h3>PROJECTS</h3>
            {_.isEmpty(projectResults) ? <div className="result">Didn't find anything</div> :
              <div>
                {_.map(projectResults, (project) => {
                  var { name, _id } = project;

                  return <Link key={_id} className="result" to={`/projects/${_id}`} onClick={closeSearch}>{_id + ` - ` + name}</Link>
                })}
              </div>
            }
          </div>
        </div>
      </div>  
    );
  }
}