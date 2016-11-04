import API from '../config';
import moment from 'moment';
import Chance from 'chance';

let storage = API.storage().ref();

/**
 *
 * Ninja upload can disptach actions and returns a promise at the same time
 * @param  {[type]} file [description]
 * @return {[type]}      [description]
 */
export const firebaseUpload = (file) => {
  
  let image_id = new Chance();

  let natural = image_id.natural(
    {
      min: 0, 
      max: 999999
  });
  
  return dispatch => {
    dispatch(isUploading({}));
    return new Promise((resolve, reject) => {
      let upload = storage.child(`images/${ _.toString(natural) }-${ file.name }`);
      upload.put(file).then((snap) => {
        if(!snap) {
          reject({error: 'no file'});
        }
        resolve(snap.downloadURL);
        dispatch(uploadComplete(snap.downloadURL));
      });
    }); 
  };
}

export const uploadComplete = (payload) => {
  return {
    type: 'UPLOAD_COMPLETE',
    payload
  }
};

export const isUploading = (payload) => {
  return {
    type: 'IS_UPLOADING',
    payload
  };
};

export const uploadError = (payload) => {
  return {
    type: 'UPLOAD_FAILED',
    payload
  }
};