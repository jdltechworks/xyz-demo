/**
 * Reducer for STYLE
 */

const Style = (state = {
  isFetching: false,
  styleTags: [],
  fetchFailed: true
}, action) => {
  switch(action.type) {
    case 'IS_FETCHING_STYLE': return {
      ...state,
      isFetching: true,
      styleTags: [],
      fetchFailed: false
    };
    break;
    case 'STYLE_FETCHING_COMPLETE': return {
      ...state,
      isFetching: false,
      styleTags: action.payload,
      fetchFailed: false
    };
    break;
    case 'IS_FETCHING_STYLE_PRODUCTS': return {
      ...state,
    }
    break;
    case 'STYLE_PRODUCT_FETCH_COMPLETE': return {
      ...state,
      products: action.payload
    }
    break;
    case 'STYLE_SORTED': return {
      ...state,
      styleTags: action.payload
    }
    break;
    case 'IS_UPDATING_STYLE': return {
      ...state
    }
    break;
    case 'STYLE_UPDATED': return {
      ...state
    }
    break;
    case 'STYLE_FETCH_FAILED': return {
      ...state,
      isFetching: false,
      styleTags: [],
      fetchFailed: true
    };
    break;
    case 'STYLE_DELETE_WARNING': return {
      ...state,
      modal: true,
      isDeleting: true,
      toDelete: action.payload
    }
    break;
    case 'IS_DELETING_STYLE': return {
      ...state,
      modal: true,
      isDeleting: false,
      isSubmitting: true,
      message: action.payload
    }
    break;
    case 'STYLE_DELETED': return {
      ...state,
      modal: true,
      isDeleting: false,
      isSubmitting: false,
      message: action.payload
    }
    break;
    case 'CLOSE_MODAL': return {
      ...state,
      modal: false,
      isDeleting: false,
      message: {},
      isSubmitting: false
    }
    break;
    default: return state;
  }
}

export default Style;