import _ from 'lodash';

const Projects = (state = {
  isSearching: false,
  NoResult: false,
  message: {},
  project: {},
  modal: false,
  collection: [],
  isSubmitting: false,
  isDeleting: false,
  isSelectingItems: false,
  isLoading: false,
  productFetched: false,
  badgeCount: 0
}, action) => {
  let { payload } = action;
  switch(action.type) {
    case 'IS_FETCHING_PROJECTS': return {
      ...state,
      isSearching: false,
      NoResult: false,
      message: {},
      collection: payload,
      isLoading: true,
      productFetched: false
    };
    break;
    case 'PROJECTS_FETCH_COMPLETED': return {
      ...state,
      isSearching: false,
      NoResult: false,
      collection: action.payload,
      message: {},
      isLoading: false,
      productFetched: false
    }
    break;
    case 'IS_SUBMITTING_PROJECT': return {
      ...state,
      message: payload,
      modal: true,
      isSubmitting: true,
      isDeleting: false
    }
    break;
    case 'IS_FETCHING_SINGLE_PROJECT': return {
      ...state,
      isLoading: true
    }
    break;
    case 'IS_PROJECTS_SEARCHED': return {
      ...state,
      searchResults: payload
    }
    break;
    case 'FETCH_SINGLE_PROJECT_COMPLETE': return {
      ...state,
      isLoading: false,
      isDeleting: false,
      project: payload
    }
    break;
    case 'ACTIVE_PROJECT_COUNT': return {
      ...state,
      badgeCount: payload
    }
    break;
    case 'IS_SELECTING_ITEMS': return {
      ...state,
      isSelectingItems: true,
      modal: false,
      initialValues: payload
    }
    break;
    case 'FETCHING_PROJECT_ITEMS': return {
      ...state,
      products: [],
      productFetched: false,
      collection: {}
    }
    break;
    case 'PROJECT_ITEMS_FETCH_COMPLETE': return {
      ...state,
      isSearching: false,
      NoResult: false,
      collection: payload,
      productFetched: true,
      isLoading: false
    }
    break;
    case 'IS_UPDATING_PROJECT': return {
      ...state,
      isSubmitting: true,
      message: payload,
      collection: {},
      count: 0,
      modal: true,
      isDeleting: false,
      isSelectingItems: true
    }
    break;
    case 'PROJECT_UPDATED': return {
      ...state,
      isSubmitting: false,
      message: action.payload,
      collection: {},
      isSearching: false,
      modal: true,
      isDeleting: false,
      isSelectingItems: true
    }
    break;
    case 'PROJECT_SUBMITTED': return {
      ...state,
      message: payload,
      modal: true,
      isSubmitting: false,
      isDeleting: false
    }
    break;
    case 'CLOSE_MODAL': return {
      ...state,
      isSubmitting: false,
      isSearching: false,
      NoResult: true,
      modal: false,
      isDeleting: false,
      isSelectingItems: false,
      isDeletingProduct: false,
      isDeletingProject: false,
      isDeleting: false
    }
    break;
    case 'IS_SEARCHING_PROJECT': return {
      ...state,
      isSearching: true,
      NoResult: false,
      collection: {},
      message: {}
    };
    break;
    case 'PROJECT_SEARCH_COMPLETED': return {
      ...state,
      isSearching: false,
      NoResult: false,
      collection: payload,
      message: {}
    };
    break;
    case 'PROJECT_ITEM_FETCH_COMPLETE': return {
      ...state,
      collection: payload
    }
    break;
    case 'PROJECT_SEARCH_FAILED': return {
      ...state,
      isSearching: false,
      NoResult: false,
      collection: payload,
      message: payload.message
    };
    break;
    case 'OFF': return {
      isSearching: false,
      NoResult: false,
      collection: {},
      message: {},
      project: {},
      modal: false,
      isSubmitting: false,
      isDeleting: false,
      isSelectingItems: false
    }
    break;
    case 'RESET_PROJECT_STATE': return {
      ...state,
      isSubmitting: false,
      isSearching: false,
      message: null,
      count: 0,
      NoResult: true,
      modal: false,
    }
    break;
    case 'PROJECT_STATUS_UPDATED': return {
      ...state,
      project: {
        status: payload
      }
    }
    break;
    case 'IS_DELETING_PROJECT': return {
      ...state,
      isDeleting: true,
      isDeletingProject: true,
      isSubmitting: false,
      projectKey: payload,
      modal: true
    }
    break;
    case 'INITALIZING_PROJECT_DELETE': return {
      ...state,
      isSubmitting: true,
      isDeleting: false,
      isDeletingProject: true,
      isDeletingProduct: false,
      message: payload,
      modal: true
    }
    break;
    case 'INITALIZING_PRODUCT_REMOVE': return {
      ...state,
      isSubmitting: true,
      isDeleting: false,
      isDeletingProject: false,
      isDeletingProduct: true,
      message: payload,
      modal: true
    }
    break;
    case 'PROJECT_DELETED': return {
      ...state,
      isSubmitting: false,
      isDeleting: false,
      isDeletingProject: false,
      message: payload,
      modal: true
    }
    break;
    case 'PRODUCT_REMOVED': return {
      ...state,
      isSubmitting: false,
      isDeleting: false,
      isDeletingProduct: false,
      message: payload,
      modal: true
    }
    break;
    case 'IS_DELETING_PRODUCT': return {
      ...state,
      isDeleting: true,
      isDeletingProject: false,
      isDeletingProduct: true,
      isSubmitting: false,
      productKey: payload,
      modal: true
    }
    break;
    case 'QUICK_ADD': return {
      ...state,
      quickAdd: true
    }
    break;
    case 'QUICK_ADD_CLOSE': return {
      ...state,
      quickAdd: false
    }
    break;
    case 'UNPACKING_SHAREPROJECT': return {
      ...state,
      isLoading: true
    }
    break;
    case 'UNPACKING_COMPLETED': return {
      ...state,
      isLoading: false,
      project: payload
    }
    break;
    case 'IS_RELEASING_PROJECT_PRODUCTS': return  {
      ...state,
      isReleasing: true,
      releaseModal: true,
      isRelease: true,
      multiple: true,
      message: payload
    }
    break;
    case 'CLOSE_RELEASE_MODAL': return {
      ...state,
      releaseModal: false,
      message: [],
      releaseStatus: undefined
    }
    break;
    case 'RELEASING_PROJECT_PRODUCTS': return {
      ...state,
      releaseStatus: payload
    }
    break;
    case 'PROJECT_PRODUCTS_RELEASED': return {
      ...state,
      releaseStatus: payload
    }
    break;
    default: return state;
  }
}

export default Projects;