

const Uploads = (state = {
  isUploading: false,
  files: null,
  failed: false
}, action ) => {
  switch(action.type) {
    case 'IS_UPLOADING': return {
      ...state,
      isUploading: true,
      files: null,
      failed: false
    };
    break;
    case 'UPLOAD_COMPLETE': return {
      ...state,
      isUploading: false,
      files: action.payload,
      failed: false
    };
    break;
    case 'UPLOAD_FAILED': return {
      ...state,
      isUploading: false,
      files: null,
      failed: true
    };
    break;
    default: return state;
  }
};

export default Uploads;