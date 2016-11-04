import _ from 'lodash';

const User = (state = {
  isSubmitting: false,
  message: {},
  credentials: {},
  collection: []
}, action) => {
  let { payload } = action;
  switch(action.type) {
    case 'IS_SUBMITTING_USER':return {
      ...state,
      isSubmitting: true,
      isDeleting: false,
      modal: true,
      message: payload
    };
    break;
    case 'ADD_USER_SUCCESS': return {
      ...state,
      isSubmitting: false,
      isDeleting: false,
      modal: true,
      message: action.payload
    };
    break;
    case 'ADD_USER_FAILED': return {
      ...state,
      isSubmitting: false,
      isDeleting: false,
      modal: true,
      message: action.payload
    };
    break;
    case 'CLOSE_MODAL': return {
      ...state,
      isSubmitting: false,
      message: null,
      modal: false,
      isDeleting: false,
    };
    break;
    case 'USERS_FETCH_COMPLETED': return {
      ...state,
      collection: action.payload,
      isLoading: false
    };
    break;
    case 'IS_FETCHING_USERS': return {
      ...state,
      isLoading: true,
      collection: []
    };
    break;
    case 'IS_DELETING_USER': return {
      ...state,
      modal: true,
      isDeleting: true,
      userDetails: action.payload,
      isSubmitting: false,
    };
    break;
    case 'DELETING_USER': return {
      ...state,
      modal: true,
      isDeleting: false,
      message: action.payload,
      isSubmitting: true,
    };
    break;
    case 'USER_DELETED': return {
      ...state,
      modal: true,
      isDeleting: false,
      message: action.payload,
      isSubmitting: false,
    };
    break;
    case 'REFRESHING_LIST': return {
      ...state,
      modal: true,
    }
    break;
    case 'USER_LIST_REFRESHED': return {
      ...state,
      modal: true,
      collection: payload,
    }
    break;
    case 'IS_FETCHING_USER': return {
      ...state,
      message: {},
      user: payload,
      isLoading: true
    };
    break;
    case 'USER_FETCH_COMPLETED': return {
      ...state,
      user: payload
    };
    break;
    default: return state;
  }
}

export default User;