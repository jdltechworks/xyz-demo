import API from '../config';
import _ from 'lodash';
import moment from 'moment';
import { browserHistory } from 'react-router';

var collection = API.database();
const _products = collection
  .ref('/items');
const _projects = collection
  .ref('/projects');

const _releases = collection.ref('/release_items');
const _usage = collection.ref('/usage');

export const initOverAllUsageCalc = () => {
  return { 
    type: 'INITIALIZE_OVERALL_USAGE_CALCULATION'
  };
}

export const getOverAllUsage = () => {

  let remainingQty = [];
  let releasedQty = [];
  return dispatch => {
    dispatch(initOverAllUsageCalc());

    let annualUsage = new Promise((resolve, reject) => {
      _usage.on('value', (snap) => {
        var result = _.groupBy(snap.val(), (item, key) => {
          let { date } = item;
          return moment(date).format('MMM');
        });
        resolve(result);
      });
    });

    let released = new Promise((resolve, reject) => {
        dispatch({ type: 'IS_CALCULATING_RELEASED_ITEMS', payload: null });
        _releases.on('value', (snap) => {
          let values = snap.val();
          if(!_.isNull(values)) {
            snap.forEach((_snap) => {
              let qty = _snap.child('quantity').val();

              releasedQty.push(qty);   
            });
            resolve(_.sum(releasedQty));
          }
        });
        
    });

    let itemUsage = new Promise((resolve, reject) => {
       _products.on('value', (snap) => {
          let values = snap.val();
          if(!_.isNull(values)) {
            snap.forEach((_snap) => {
              let qty = _snap.child('usage').val();
              remainingQty.push(qty);
            });
            resolve(_.sum(remainingQty));
          }
        });
       dispatch({ type: 'IS_CALCULATING_REMAINING_ITEMS', payload: null });
    });

    return Promise.all([annualUsage, released, itemUsage]).then( value => {
      let relQty = value[1];
      let item_usage = value[2] * .10;
      let usage = value[0];
      
      return { overall_usage: item_usage, usage };
    }, reason => {
      console.log(reason);
    });
  }
}

export const resetUsageCalc = () => {
  return { 
    type: 'RESETTING_OVERALL_USAGE_CALCULATION'
  };
}