import _ from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { toggleClass, toggleLocation } from './toggle';
import { add_to_project } from './actions';


@reduxForm({
  form: 'add-to-project'
})

export default class Available extends Component {
  toggle(e) {
    e.preventDefault();
    let { currentTarget } = e;
    let { parentNode } = currentTarget;
    parentNode
      .parentNode.classList.toggle('active');
  }
  componentDidMount() {
  }
  render() {
    let { handleSubmit } = this.props;
    return(
      <div className="tools-wrap tool-panel">
        <div className="tool-btns">
          <span className="tool-btn add-btn" onClick={this.toggle.bind(this)}><em className="icon icon-add"></em></span> 
        </div>
        <div className="tool-panel-content">

          <div className="content-inner">
            <form onSubmit={handleSubmit((props) => {
              let { _id, getProjectDetails } = this.props;
              getProjectDetails({ product_id: _id, project_id: props.project });
            })}>
              <h4>ADD TO PROJECT</h4>
              <div className="select-form">
                <Field name="project" component="select">
                  <option value={null}>SELECT A PROJECT</option>
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