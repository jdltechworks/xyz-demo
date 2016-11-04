import _ from 'lodash';

const Products = (state = {
  isSubmitting: false,
  isSearching: false,
  isFiltered: false,
  NoResult: false,
  count: 0,
  message: {},
  modal: false,
  productKey: null,
  isGrid: true,
  isEndOfProductsList: false,
  hasFilters: false
}, action) => {
  let {
    payload,
    isEndOfProductsList,
    orderByKey,
    sorted,
    hasFilters
  } = action;

  switch(action.type) {
    case 'IS_FETCHING_USERS': return {
      ...state,
      count: 0,
      isLoading: true,
      users: payload,
      isSubmitting: false
    } 
    break;
    case 'IS_FETCHING_NOTES': return {
      ...state,
      count: 0,
      isLoading: true,
      notes: payload,
      isSubmitting: false
    }
    break;
    case 'IS_FETCHING_PRODUCTS': return {
      ...state,
      isSearching: false,
      NoResult: false,
      message: {},
      product: {},
      isSubmitting: false,
      isLoading: true,
      collection: payload
    };
    break;
    case 'IS_FETCHING_PRODUCT': return {
      ...state,
      isSearching: false,
      NoResult: false,
      count: 0,
      message: {},
      isSubmitting: false,
      isLoading: true
    };
    break;
    case 'IS_FILTERING_PRODUCTS': return {
      ...state,
      isSearching: true,
      isFiltered: false,
      collection: payload,
    };
    break;
    case 'IS_PRODUCTS_FILTERED': return {
      ...state,
      collection: payload,
      isSearching: false,
      isFiltered: true,
      isLoading: false,
      isEndOfProductsList,
      orderByKey,
      sorted,
      hasFilters
    };
    break;
    case 'IS_PRODUCTS_SEARCHED': return {
      ...state,
      searchResults: payload
    }
    break;
    case 'PRODUCTS_DEFAULT_VIEW_TYPE': return {
      ...state,
      isGrid: payload
    }
    case 'INITIALIZE_PRODUCT_RELEASE': return {
      ...state,
      isSubmitting: true,
      isRelease: false,
      isReleasing: true,
      message: payload
    };
    break;
    case 'PRODUCT_RELEASE_COMPLETED': return {
      ...state,
      isSubmitting: false,
      isRelease: true,
      isReleasing: false,
      message: payload
    };
    break;
    case 'CLOSE_MODAL': return {
      ...state,
      isSubmitting: false,
      isSearching: false,
      isReleasing: false,
      message: null,
      NoResult: true,
      modal: false,
      isDeleting: false,
      productDetails: {},
      isUpdate: false,
      isRelease: false
    }
    break;
    case 'IS_FETCHING_PROJECT_OPTIONS': return {
      ...state,
      options: [],
      isFecthingOptions: true
    };
    break;
    case 'FETCH_PROJECT_OPTIONS_COMPLETE': return {
      ...state,
      options: payload,
      isFecthingOptions: false
    };
    break;
    case 'PRODUCT_COUNT': return {
      ...state,
      count: payload
    }
    break;
    case 'SORT': return {
      ...state,
      collection: payload,
      orderByKey,
      sorted
    }
    break;
    case 'PRODUCTS_FETCH_COMPLETED': return {
      ...state,
      isSearching: false,
      NoResult: false,
      isLoading: false,
      collection: payload,
      message: {},
      isSubmitting: false,
      isEndOfProductsList,
      orderByKey,
      sorted,
      hasFilters
    }
    break;
    case 'PRODUCT_FETCH_COMPLETED': return {
      ...state,
      product: payload,
      isSearching: false,
      NoResult: false,
      isLoading: false,
    }
    break;
    case 'IS_SUBMITTING_PRODUCT': return {
      ...state,
      isSubmitting: true,
      message: action.payload,
      collection: {},
      count: 0,
      modal: true
    }
    break;
    case 'ADD_PRODUCTS_TO_PROJECTS': return {
      ...state,
      isUpdate: true,
      productDetails: action.payload,
      modal: true,
      isUpdating: false,
      hasOneProduct: false
    }
    break;
    case 'ADD_PRODUCT_TO_PROJECT': return {
      ...state,
      isSubmitting: true,
      isUpdate: true,
      message: action.payload,
      modal: true,
      isUpdating: true,
      hasOneProduct: true
    }
    break;
    case 'IS_UPDATING_PRODUCT': return {
      ...state,
      isSubmitting: true,
      isUpdate: true,
      message: action.payload,
      collection: {},
      count: 0,
      isUpdating: true,
      modal: true
    }
    break;
    case 'PRODUCT_ADDED': return {
      ...state,
      isSubmitting: false,
      isUpdate: true,
      message: action.payload,
      modal: true,
      isUpdating: true,
      hasOneProduct: true
    }
    break;
    case 'PRODUCT_UPDATED': return {
      ...state,
      isSubmitting: false,
      message: action.payload,
      isSearching: false,
      modal: true,
      isUpdate: true,
      isUpdating: true
    }
    break;
    case 'PRODUCT_SUBMITTED': return {
      ...state,
      isSubmitting: false,
      message: action.payload,
      collection: {},
      isSearching: false,
      modal: true,
      deleted: false
    }
    break;
    case 'SUBMIT_FAILED': return {
      ...state,
      isSubmitting: false,
      message: action.payload,
      collection: {},
      product: {},
      isSearching: false
    }
    break;
    case 'IS_SEARCHING': return {
      ...state,
      isSearching: true,
      NoResult: false,
      collection: {},
      count: 0,
      message: {},
      isSubmitting: false,
    };
    break;
    case 'SEARCH_COMPLETED': return {
      ...state,
      isSearching: false,
      NoResult: false,
      collection: action.payload,
      count: 0,
      message: {},
      isSubmitting: false,
    };
    break;
    case 'SEARCH_FAILED': return {
      ...state,
      isSearching: false,
      NoResult: false,
      collection: action.payload.result,
      count: 0,
      message: action.payload.message,
      isSubmitting: false,
    };
    break;
    case 'IS_RELEASING_PRODUCT': return {
      ...state,
      modal: true,
      isSubmitting: false,
      productKey: payload,
      isRelease: true,
      isReleasing: true
    };
    break;
    case 'IS_DELETING_PRODUCT': return {
      ...state,
      modal: true,
      isSubmitting: false,
      productKey: payload,
      isDeleting: true
    };
    break;
    case 'IS_DELETING_NOTE': return {
      ...state,
      modal: true,
      isSubmitting: false,
      noteKey: payload, 
      isDeleting: true,
      isNote: true
    };
    break;
    case 'IS_DELETING_PRODUCTS': return {
      ...state,
      modal: true,
      isSubmitting: false,
      productDetails: payload,
      isDeleting: true
    };
    break;
    case 'INITIALIZE_PRODUCT_DELETION': return {
      ...state,
      modal: true,
      isSubmitting: true,
      message: action.payload,
      isDeleting: false
    }
    break;
    case 'INITIALIZE_ADDING_NOTE': return {
      ...state,
      modal: true,
      isSubmitting: true,
      message: payload,
      isAdding: false
    }
    break;
    case 'IS_ADDING_NOTES': return {
      ...state,
      modal: true,
      isSubmitting: false,
      message: payload,
      isAdding: true
    }
    break;
    case 'ADDING_NOTES_COMPLETED': return {
      ...state,
      modal: true,
      isSubmitting: false,
      message: payload,
      isAdding: false
    }
    break;
    case 'PRODUCT_DELETED': return {
      ...state,
      modal: true,
      isSubmitting: false,
      message: action.payload,
      isDeleting: false,
      productKey: null,
      deleted: true
    }
    break;
    case 'USERS_FETCHED_COMPLETED': return {
      ...state,
      isFecthingOptions: false,
      users: payload,
    }
    break;
    case 'NOTE_FETCH_COMPLETED': return {
      ...state,
      isFecthingOptions: false,
      notes: payload
    }
    break;
    case 'UNPACKING_SHAREPRODUCT': return {
      ...state,
      isLoading: true
    }
    break;
    case 'UNPACKING_COMPLETED': return {
      ...state,
      isLoading: false,
      product: payload
    }
    break;
    default: return state;
  }
}

export default Products;