/**
 * Reducer for PALLETE
 */

const Pallete = (state = {
  isFetching: false,
  palleteTags: [],
  fetchFailed: true
}, action) => {
  switch(action.type) {
    case 'IS_FETCHING_PALLETE': return {
      ...state,
      isFetching: true,
      palleteTags: [],
      fetchFailed: false
    };
    break;
    case 'PALLETE_FETCHING_COMPLETE': return {
      ...state,
      isFetching: false,
      palleteTags: action.payload,
      fetchFailed: false
    };
    break;
    case 'IS_FETCHING_PALLETE_PRODUCTS': return {
      ...state,
    }
    break;
    case 'PALLETE_PRODUCT_FETCH_COMPLETE': return {
      ...state,
      products: action.payload
    }
    break;
    case 'PALLETE_SORTED': return {
      ...state,
      palleteTags: action.payload
    }
    break;
    case 'IS_UPDATING_PALLETE': return {
      ...state
    }
    break;
    case 'PALLETE_UPDATED': return {
      ...state
    }
    break;
    case 'PALLETE_FETCH_FAILED': return {
      ...state,
      isFetching: false,
      palleteTags: [],
      fetchFailed: true
    };
    break;
    case 'PALLETE_DELETE_WARNING': return {
      ...state,
      modal: true,
      isDeleting: true,
      toDelete: action.payload
    }
    break;
    case 'IS_DELETING_PALLETE': return {
      ...state,
      modal: true,
      isDeleting: false,
      isSubmitting: true,
      message: action.payload
    }
    break;
    case 'PALLETE_DELETED': return {
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

export default Pallete;