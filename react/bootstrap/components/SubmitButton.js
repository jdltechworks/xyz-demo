import _ from 'lodash';
import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
/**
 * @todo  add this somewhere (helper)
 * bind to component
 * 
 */

export default class SubmitButton extends Component {
  componentDidMount() {
    
  }
  render() {
    let { props } = this;
    let { pristine , submitting, reset, params: { alphanum }, location: { pathname } } = props;
    let style = {
      display: 'none'
    }

    let path = _.compact(pathname.split('/'));
    
    return (
      <div className="bottom-filter bottom-saver">
        <div className="valign">
          <div className="valign-content">
            {_.includes(path, 'edit') ?
              <Link to={`/${path[0]}/${alphanum}`} className="btn btn-filter btn-dark">
                <span className="icon icon-eye"></span>VIEW
              </Link> : null
            }
            <button disabled={ submitting } className="submit-button btn btn-filter btn-primary">
              <span className="icon icon-check-white"></span>SAVE
            </button>
            <button disabled={pristine || submitting} onClick={reset} className="reset-button btn btn-filter btn-dark">
              <span className="icon icon-remove-2"></span>{_.includes(path, 'edit') ? `CANCEL`: `CLEAR`}
            </button>
          </div>
        </div>
      </div>
      );
  }
}