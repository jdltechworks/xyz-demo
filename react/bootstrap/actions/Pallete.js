import API from '../config';

let collection = API.database();
let _pallete = collection.ref('/palletes');
let _products = collection.ref('/items');

export const fetchPallete = () => {
  let items = [];
  return dispatch => {
    dispatch(isFetchingPallete({}));
    _pallete.on('value', (snap) => {
      if(_.isNull(snap.val())) {
        dispatch(palleteFetchComplete([]));
      } else { 
        dispatch(palleteFetchComplete(_.uniq(snap.val())));
      }
        
    });
  }
};

export const fetchItemsInPallete = (payload) => {
  
  return dispatch => {
    let _productKeys = [];
    dispatch(isFetchingPalleteProducts(null));
    _pallete.on('child_added', (snap) => {
      _products.orderByKey().on('value', (productSnap) => {
        productSnap.forEach((product) => {
          let toSearch = snap.val();
          let _tags = product.child('palletes').val();
          if(_.includes(_tags, toSearch)) {
            _productKeys.push({ name: toSearch, key: _tags});
          }
        });
        dispatch(palleteProductsFetchComplete(_productKeys));
      });
      
    });
  }
}

export const isFetchingPalleteProducts = (payload) => {
  _products.off();
  return {
    type: 'IS_FETCHING_PALLETE_PRODUCTS',
    payload
  };
};

export const palleteProductsFetchComplete = (payload) => {
  return {
    type: 'PALLETE_PRODUCT_FETCH_COMPLETE',
    payload
  }
};

export const sortPallete = (payload) => {
  let sanitized = _.uniq(payload);
  let dupCatch = [];
  return dispatch => {
    _.map(sanitized, (value, key) => {
      _pallete.child(key).set(value);
    });

    dispatch({ type: 'SORTED', payload});
  }
};

export const updatePallete = (payload) => {
  let { key, name } = payload;
  return dispatch => {
    dispatch({ type: 'IS_UPDATING_PALLETE'});
    _pallete.child(key).set(name).then(((updated) => {
      dispatch({ type: 'PALLETE_UPDATED'});
    }));
  }
}

export const isDeletingPallete = (payload) => {
  return {
    type: 'IS_DELETING_PALLETE',
    payload
  };
};

export const categoryDeleted = (payload) => {
  return {
    type: 'CATEGORY_DELETED',
    payload
  }
};

export const addPallete = (payload) => {
  return dispatch => {
    let key = _pallete.push().key;
    _pallete.child(key).set(payload);
    dispatch({ type: 'PALLETE_ADDED'});
  };
}

export const initializeDeletePallete = (payload) => {
  let { tag, key } = payload;
  return dispatch => {
    dispatch(isDeletingPallete({
      status: 'DELETING',
      icon: 'glyphicon glyphicon-ok',
      details: 'Please wait...',
      link: '/'
    }));
    setTimeout(() => {
      _pallete.orderByValue().equalTo(tag).on('value', (snap) => {
        let values = snap.val();
        for(var i in values) {
          _pallete.child(i).remove();
        }
      });
      
      dispatch(palleteDeleted({
        status: 'DELETED',
        icon: 'glyphicon glyphicon-ok',
        details: `Successfully delete ${tag}`,
        link: '/'
      }));
    }, 4500);
  }
};

export const palleteDeleteWarning = (payload) => {
  return {
    type: 'PALLETE_DELETE_WARNING',
    payload
  }
};

export const closePalleteModal = () => {
  return {
    type: 'CLOSE_MODAL'
  }
}

export const isFetchingPallete = (payload) => {
  _pallete.off();
  return {
    type: 'IS_FETCHING_PALLETE',
    payload
  };
};

export const palleteFetchComplete = (payload) => {
  return {
    type: 'PALLETE_FETCHING_COMPLETE',
    payload
  };
};

export const palleteFetchError = (payload) => {
  return {
    type: 'PALLETE_FETCH_FAILED',
    payload
  };
};