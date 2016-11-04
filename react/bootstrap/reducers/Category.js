/**
 * Reducer for CATEGORY
 */

const Category = (state = {
  isFetching: false,
  categoriesTags: [],
  fetchFailed: true
}, action) => {
  switch(action.type) {
    case 'IS_FETCHING_CATEGORY': return {
      ...state,
      isFetching: true,
      categoriesTags: [],
      fetchFailed: false
    };
    break;
    case 'CATEGORY_FETCHING_COMPLETE': return {
      ...state,
      isFetching: false,
      categoriesTags: action.payload,
      fetchFailed: false
    };
    break;
    case 'IS_FETCHING_CATEGORY_PRODUCTS': return {
      ...state,
    }
    break;
    case 'CATEGORY_PRODUCT_FETCH_COMPLETE': return {
      ...state,
      products: action.payload
    }
    break;
    case 'CATEGORIES_SORTED': return {
      ...state,
      categoriesTags: action.payload
    }
    break;
    case 'IS_UPDATING_CATEGORIES': return {
      ...state
    }
    break;
    case 'CATEGORY_UPDATED': return {
      ...state
    }
    break;
    case 'CATEGORY_FETCH_FAILED': return {
      ...state,
      isFetching: false,
      categoriesTags: [],
      fetchFailed: true
    };
    break;
    case 'CATEGORY_DELETE_WARNING': return {
      ...state,
      modal: true,
      isDeleting: true,
      toDelete: action.payload
    }
    break;
    case 'IS_DELETING_CATEGORY': return {
      ...state,
      modal: true,
      isDeleting: false,
      isSubmitting: true,
      message: action.payload
    }
    break;
    case 'CATEGORY_DELETED': return {
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

export default Category;