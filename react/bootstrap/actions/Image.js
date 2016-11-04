import _ from 'lodash';
import API from '../config';

let collection = API.database();
const _products = collection
  .ref('/items');


export const fetchProductPreview = (payload) => {
  let preview = [];
  return dispatch => {
    _.map(payload, (value, key) => {
      _products.orderByKey()
        .equalTo(value)
        .on('child_added', (snap) => {
          let image = snap.child('images').val()[0];
          preview.push(image);
        });
    });

    setTimeout(()=>dispatch(thumbnailFetched(preview)), 100);

    
  }
};

export const setImagePreview = (payload) => {

  return dispatch => {
    if(_.eq(preview.indexOf(payload, 0), -1)) {
      preview.push(payload);
    } else {
      for( var i in preview ) {
        if(_.eq(preview[i], payload)) {
          console.log(preview[i]);
          preview.splice(i, 1);  
        }
      }
     console.log(preview);
    }
    dispatch(thumbnailFetched(preview));

  }
}
export const isFetchingThumbnail = (payload) => {
  return {
    type: 'IS_FETCHING_IMAGE',
    payload
  }
};

export const thumbnailFetched = (payload) => {
  return {
    type: 'IMAGE_FETCHED',
    payload
  }
};

export const resetImage = (payload) => {
  return {
    type: 'RESET_IMAGE',
    payload
  }
}