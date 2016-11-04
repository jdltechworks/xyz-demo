import API from '../config';

let collection = API.database();
let _style = collection.ref('/styles');
let _products = collection.ref('/items');

export const fetchStyle = () => {
  let items = [];
  return dispatch => {
    dispatch(isFetchingStyle({}));
    _style.on('value', (snap) => {
      if(_.isNull(snap.val())) {
        dispatch(styleFetchComplete([]));
      } else { 
        dispatch(styleFetchComplete(_.uniq(snap.val())));
      }
        
    });
  }
};

export const fetchItemsInStyle = (payload) => {
  
  return dispatch => {
    let _productKeys = [];
    dispatch(isFetchingStyleProducts(null));
    _style.on('child_added', (snap) => {
      _products.orderByKey().on('value', (productSnap) => {
        productSnap.forEach((product) => {
          let toSearch = snap.val();
          let style = product.child('styles').val();
          if(_.includes(style, toSearch)) {
            _productKeys.push({ name: toSearch, key: style});
          }
        });
        dispatch(styleProductsFetchComplete(_productKeys));
      });
      
    });
  }
}

export const isFetchingStyle = (payload) => {
  return {
    type: 'IS_FETCHING_STYLE',
    payload
  }
};

export const isFetchingStyleProducts = (payload) => {
  _products.off();
  return {
    type: 'IS_FETCHING_STYLE_PRODUCTS',
    payload
  };
};

export const styleProductsFetchComplete = (payload) => {
  return {
    type: 'STYLE_PRODUCT_FETCH_COMPLETE',
    payload
  }
};

export const sortStyle = (payload) => {
  let sanitized = _.uniq(payload);
  let dupCatch = [];
  return dispatch => {
    _.map(sanitized, (value, key) => {
      _style.child(key).set(value);
    });
    dispatch({ type: 'SORTED', payload});
  }
};

export const updateStyle = (payload) => {
  let { key, name } = payload;
  return dispatch => {
    dispatch({ type: 'IS_UPDATING_STYLE'});
    _style.child(key).set(name).then(((updated) => {
      dispatch({ type: 'STYLE_UPDATED'});
    }));
  }
}

export const isDeletingStyle = (payload) => {
  return {
    type: 'IS_DELETING_STYLE',
    payload
  };
};

export const styleDeleted = (payload) => {
  return {
    type: 'STYLE_DELETED',
    payload
  }
};

export const addStyle = (payload) => {
  return dispatch => {
    let key = _style.push().key;
    _style.child(key).set(payload);
    dispatch({ type: 'STYLE_ADDED'});
  };
}

export const initializeDeleteStyle = (payload) => {
  let { tag, key } = payload;
  return dispatch => {
    dispatch(isDeletingStyle({
      status: 'DELETING',
      icon: 'glyphicon glyphicon-ok',
      details: 'Please wait...',
      link: '/'
    }));
    setTimeout(() => {
      _style.orderByValue().equalTo(tag).on('value', (snap) => {
        let values = snap.val();
        _.map(values, (value, key) => {
          _style.child(key).remove();
        });
      });
      
      dispatch(styleDeleted({
        status: 'DELETED',
        icon: 'glyphicon glyphicon-ok',
        details: `Successfully delete ${tag}`,
        link: '/'
      }));
    }, 4500);
  }
};

export const styleDeleteWarning = (payload) => {
  return {
    type: 'STYLE_DELETE_WARNING',
    payload
  }
};

export const closeStyleModal = () => {
  return {
    type: 'CLOSE_MODAL'
  }
}

export const isFecthingSTYLE = (payload) => {
  _style.off();
  return {
    type: 'IS_FETCHING_STYLE',
    payload
  };
};

export const styleFetchComplete = (payload) => {
  return {
    type: 'STYLE_FETCHING_COMPLETE',
    payload
  };
};

export const styleFetchError = (payload) => {
  return {
    type: 'STYLE_FETCH_FAILED',
    payload
  };
};