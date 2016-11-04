import _ from 'lodash';
import moment from 'moment';

export const product_collection = (projects, products) => {
  
  let currentState = null;
  let c_date = moment(Date.now()).format('L');
  let project_props = {};
  let _found_inv = {};
  let _gathered_project_props = [];
  let _products = _.cloneDeep(products);
  if(!_.isEmpty(projects)) {

    for ( var project of projects ) {
      let { _id, 
            startDate, 
            endDate, 
            street, 
            suburb,
            name } = project;
      if(_.has(project, 'items')) {
        for ( var collection of project.items ) {
          
          let _requested_items = (data) => {
            return _.eq(data._id, collection);
          }
          
          _found_inv = _products.find(_requested_items);

          project_props = { p_id: _id, startDate, endDate, street, suburb, p_name: name};
          
          _gathered_project_props.push(project_props);
          

          if(!_.isUndefined(_found_inv)) {
            if(c_date <= endDate && _.size(_gathered_project_props) > 1) {
              currentState = _.minBy(_gathered_project_props, (o) => o.endDate);
              Object.assign(_found_inv, currentState);
            } 
            Object.assign(_found_inv, project_props);       
          }

        }
      }
    }
  
  }
  return _products;
};