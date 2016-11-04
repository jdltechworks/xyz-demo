import API from '../config';

var collection = API.database();
var _rooms  = collection.ref('/rooms');
let _products = collection.ref('/items');

export const fetchRooms = () => {
  return dispatch => {
    dispatch(isFetchingRooms({}));
    _rooms.on('value', (snap) => {
      if(_.isNull(snap.val())) {
        dispatch(roomsFetchComplete([]));
      } else { 
        dispatch(roomsFetchComplete(_.uniq(snap.val())));
      }
        
    });
  }
};

export const fetchItemsInRoom = (payload) => {
  
  return dispatch => {
    let _productKeys = [];
    dispatch(isFetchingRoomsProducts(null));
    _rooms.on('child_added', (snap) => {
      _products.orderByKey().on('value', (productSnap) => {
        productSnap.forEach((product) => {
          let toSearch = snap.val();
          let rooms = product.child('rooms').val();
          if(_.includes(rooms, toSearch)) {
            _productKeys.push({ name: toSearch, key: rooms});
          }
        });
        dispatch(roomProductsFetchComplete(_productKeys));
      });
      
    });
  }
}

export const isFetchingRoomsProducts = (payload) => {
  _products.off();
  return {
    type: 'IS_FETCHING_ROOM_PRODUCTS',
    payload
  };
};

export const roomProductsFetchComplete = (payload) => {
  return {
    type: 'ROOM_PRODUCT_FETCH_COMPLETE',
    payload
  }
};

export const sortRooms = (payload) => {
  let sanitized = _.uniq(payload);
  let dupCatch = [];
  return dispatch => {
    _.map(sanitized, (value, key) => { 
      _rooms.child(key).set(value);
    });

    dispatch({ type: 'SORTED', payload});
  }
};

export const isDeletingRooms = (payload) => {
  return {
    type: 'IS_DELETING_ROOM',
    payload
  };
};

export const RoomsDeleted = (payload) => {
  return {
    type: 'ROOM_DELETED',
    payload
  }
};

export const addRooms = (payload) => {
  return dispatch => {
    let key = _rooms.push().key;
    _rooms.child(key).set(payload);
    dispatch({ type: 'ROOM_ADDED'});
  };
}

export const initializeDeleteRooms = (payload) => {
  let { tag, key } = payload;
  return dispatch => {
    dispatch(isDeletingRooms({
      status: 'DELETING',
      icon: 'glyphicon glyphicon-ok',
      details: 'Please wait...',
      link: '/'
    }));
    setTimeout(() => {
      _rooms.orderByValue().equalTo(tag).on('value', (snap) => {
        let values = snap.val();
        _.map(values, (value, key) => {
          _rooms.child(key).remove();
        });
      });
      
      dispatch(RoomsDeleted({
        status: 'DELETED',
        icon: 'glyphicon glyphicon-ok',
        details: `Successfully delete ${tag}`,
        link: '/'
      }));
    }, 4500);
  }
};

export const roomsDeleteWarning = (payload) => {
  return {
    type: 'ROOM_DELETE_WARNING',
    payload
  }
};

export const closeRoomsModal = () => {
  return {
    type: 'CLOSE_MODAL'
  }
}

export const updateRooms = (payload) => {
  let { key, name } = payload;
  return dispatch => {
    dispatch({ type: 'IS_UPDATING_ROOM'});
    _rooms.child(key).set(name).then(((updated) => {
      dispatch({ type: 'ROOM_UPDATED'});
    }));
  }
}


export const isFetchingRooms = (payload) => {
  _rooms.off();
  return {
    type: 'IS_FETCHING_ROOM',
    payload
  };
};

export const roomsFetchComplete = (payload) => {
  return {
    type: 'ROOM_FETCHING_COMPLETE',
    payload
  };
};

export const ROOMFetchError = (payload) => {
  return {
    type: 'ROOM_FETCH_FAILED',
    payload
  };
};