import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { _selector } from '../index';
import Available from './available';
import CheckedOut from './checkedout';
import CheckedOutInLocation from './inlocation';
import Disabled from './disabled';

/**
 * Assign action component to an item
 * @param  {object} obj        item properties
 * @param  {object} properties attribues and object for an item
 * @return {object}            Returns the correct component for an item
 */
const assignStatusAction = function (obj, properties) {
  let actionType = 0;
  let props = {};

  props = Object.assign({}, obj);

  let c_date = moment(Date.now()).format('L');

  properties ? Object.assign(props, properties): props;

  
  let { _id, project_data, startDate, endDate } = props;
  
  const s_date = props.startDate;
  
  const e_date = props.endDate;
  
  if(project_data) {
    let _g_sdate = _.gte(project_data.startDate, startDate);
    let _l_edate = _.lte(project_data.endDate, endDate);

    if(_g_sdate && _l_edate){
      if(!_.has(properties, 'formType')) {
        actionType = 3;
      } else {
        actionType = 0;
      }
      
    } else {
      actionType = 0;
    }
  } else {
    if( c_date < s_date && c_date < e_date ) {
      actionType = 1;
    }
    if(c_date >= s_date && c_date < e_date) {
      actionType = 2;
    }
  }
  let component = [
    <Available {...props}/>,
    <CheckedOut {...props}/>,
    <CheckedOutInLocation {...props} />,
    <Disabled {...props} />
  ];

  let extractedComponent = component[actionType];
  return extractedComponent;
};



export default assignStatusAction;