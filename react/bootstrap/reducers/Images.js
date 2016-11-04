const Images = (state = {
  preview: null,
  thumbnail: [],
  fullview: null
}, action) => {
  switch(action.type) {
    case 'IS_FETCHING_IMAGE': return {
      ...state,
      preview: null,
      thumbnail: [],
      fullview: null
    };
    break;
    case 'IMAGE_FETCHED': return {
      ...state,
      preview: action.payload,
      thumbnail: action.payload,
      fullview: null
    };
    break;
    case 'FETCH_IMAGE_FAILED': return {
      ...state,
      preview: null,
      thumbnail: [],
      fullview: null     
    };
    break;
    case 'CLOSE_MODAL': return {
      ...state,
      preview: null,
      thumbnail: null,
      fullview: null   
    };
    break;
    case 'RESET_IMAGE': return {
      ...state,
      preview: null,
      thumbnail: null,
      fullview: null,
    }
    break;
    default: return state;
  }
}

export default Images;