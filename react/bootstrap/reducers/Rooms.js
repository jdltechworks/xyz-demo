/**
 * Reducer for ROOM
 */

const Rooms = (state = {
  isFetching: false,
  roomsTags: [],
  fetchFailed: true
}, action) => {
  switch(action.type) {
    case 'IS_FETCHING_ROOM': return {
      ...state,
      isFetching: true,
      roomsTags: [],
      fetchFailed: false
    };
    break;
    case 'ROOM_FETCHING_COMPLETE': return {
      ...state,
      isFetching: false,
      roomsTags: action.payload,
      fetchFailed: false
    };
    break;
    case 'IS_FETCHING_ROOM_PRODUCTS': return {
      ...state,
    }
    break;
    case 'ROOM_PRODUCT_FETCH_COMPLETE': return {
      ...state,
      products: action.payload
    }
    break;
    case 'ROOM_SORTED': return {
      ...state,
      roomsTags: action.payload
    }
    break;
    case 'IS_UPDATING_ROOM': return {
      ...state
    }
    break;
    case 'ROOM_UPDATED': return {
      ...state
    }
    break;
    case 'ROOM_FETCH_FAILED': return {
      ...state,
      isFetching: false,
      roomsTags: [],
      fetchFailed: true
    };
    break;
    case 'ROOM_DELETE_WARNING': return {
      ...state,
      modal: true,
      isDeleting: true,
      toDelete: action.payload
    }
    break;
    case 'IS_DELETING_ROOM': return {
      ...state,
      modal: true,
      isDeleting: false,
      isSubmitting: true,
      message: action.payload
    }
    break;
    case 'ROOM_DELETED': return {
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

export default Rooms;