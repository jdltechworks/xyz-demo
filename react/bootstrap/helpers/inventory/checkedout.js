import _ from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import { add_to_project } from './actions';
import { toggleClass, toggleLocation } from './toggle';

export default class CheckedOut extends Component {
  exec_action(item_id, image, e) {
  e.preventDefault();
  let { project_data } = this.props;
  let { insert_item, request_remove_item } = this.context;
  let { previosSibling, firstChild, parentNode } = e.currentTarget;

    if( project_data ) {
      if( !project_data.page ) {
        firstChild.className = 
          firstChild.className === 'icon icon-add' ? 'icon icon-remove' : 'icon icon-add';
          parentNode
            .firstChild
              .style
                .display = parentNode.firstChild.style.display ===  'block' ? 'none': 'block';
        if(_.isFunction(insert_item)) {
          insert_item(item_id, image);
        }
      } else {
        if(_.isFunction(request_remove_item)) {
          request_remove_item(item_id);
        }
      }
    } else {
      previousSibling
        .style
          .display = previousSibling.style.display ===  'block' ? 'none': 'block';
    }

  }
  add_to_project(e){
    e.preventDefault();
    let { _id } = this.props;
    this.context.update_project(this.refs.project_id.value, _id);
    this.context.set_add_to_project(_id, parseInt(this.refs.project_id.value));
  }
  render() {
    let hide = { display: 'none' }; 
    let { project_data, 
          images, 
          _id, 
          startDate, 
          endDate, 
          street, 
          suburb,
          p_name
        } = this.props;
    let { bind_projects , is_authenticated } = this.context;
    let address = () => {
      return `${suburb} ${street}`;
    };
    let options = [];
    bind_projects.map((project, key) => {
      let _g_sdate = _.gte(project.startDate, startDate);
      let _l_edate = _.lte(project.endDate, endDate);
      let disabled = false;
      disabled = false;
      if(_g_sdate && _l_edate){
      disabled = true;
      } else {
      options.push(<option key={key} value={project._id}>{project.name.toUpperCase()}</option>)
      }
    });
    
    return(
      <div className="tools-wrap tool-panel">
        {!project_data ?  
          <div className="checkout-location-btn">
            <div className="tool-btns">
              <span className="tool-btn lock-btn btn-to-hide" onClick={toggleLocation.bind(this, 'lock')} ><em className="icon icon-lock"></em></span>
              <span onClick={toggleClass.bind(this, 'checkedout')} className="tool-btn add-btn"><em className="icon icon-add"></em></span>
            </div>
            <ul className="tool-tap">
                <li><em className="icon icon-lock"></em>{moment(new Date(startDate)).format('MM.DD')} - {moment(new Date(endDate)).format('MM.DD')}</li>
                <li><em className="icon icon-location"></em>{_.upperCase(p_name)}</li>
            </ul>
          </div>
          :
            !project_data.page ?
            <div className="tool-btns">
              <span className="tool-btn check-btn" style={hide}><em className="icon icon-check"></em></span>
              <span className="tool-btn lock-btn btn-to-hide"><em className="icon icon-lock"></em></span>
              <span onClick={this.exec_action.bind(this, _id, images[0])} className="tool-btn add-btn"><em className="icon icon-add"></em></span>
            </div>:
            <div className="tool-btns">
              <span onClick={this.exec_action.bind(this, _id, images[0])} className="tool-btn remove-btn"><em className="icon icon-add"></em></span>
            </div>
        }
        {!project_data ?
          is_authenticated ?
          <div className="tool-panel-content">
            <div className="content-inner">
              <h4>ADD TO PROJECT</h4>
              <form onSubmit={this.add_to_project.bind(this)}>
              <div className="select-form">
                <select ref="project_id" name="project_id" defaultValue="SELECT PROJECT">
                  {options}
                </select>
              </div>
              <button className="btn btn-success btn-block"><span className="icon icon-check"></span>SAVE</button>
              </form>
            </div>
          </div>: null
        : null}
      </div>
    );
  }
}

CheckedOut.contextTypes = {
  bind_projects: React.PropTypes.array,
  _items: React.PropTypes.array,
  insert_item: React.PropTypes.func,
  update_project: React.PropTypes.func,
  set_add_to_project: React.PropTypes.func,
  is_authenticated: React.PropTypes.bool,
  request_remove_item: React.PropTypes.func
}