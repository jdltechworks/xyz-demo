import API from '../config';

var collection = API.database();
var _categories  = collection.ref('/categories');
let _products = collection.ref('/items');

export const fetchCategories = () => {
  return dispatch => {
    dispatch(isFetchingCategories({}));
    _categories.on('value', (snap) => {
      if(_.isNull(snap.val())) {
        dispatch(categoryFetchComplete([]));
      } else { 
        dispatch(categoryFetchComplete(_.uniq(snap.val())));
      }
        
    });
  }
};

export const fetchItemsInCategories = (payload) => {
  
  return dispatch => {
    let _productKeys = [];
    dispatch(isFetchingCategoryProducts(null));
    _categories.on('child_added', (snap) => {
      _products.orderByKey().on('value', (productSnap) => {
        productSnap.forEach((product) => {
          let toSearch = snap.val();
          let _categories = product.child('categories').val();
          if(_.includes(_categories, toSearch)) {
            _productKeys.push({ name: toSearch, key: _categories});
          }
        });
        dispatch(categoryProductsFetchComplete(_productKeys));
      });
      
    });
  }
}

export const isFetchingCategoryProducts = (payload) => {
  _products.off();
  return {
    type: 'IS_FETCHING_CATEGORY_PRODUCTS',
    payload
  };
};

export const categoryProductsFetchComplete = (payload) => {
  return {
    type: 'CATEGORY_PRODUCT_FETCH_COMPLETE',
    payload
  }
};

export const sortCategories = (payload) => {
  let sanitized = _.uniq(payload);
  let dupCatch = [];
  return dispatch => {
    _.map(sanitized, (value, key) => {
      _categories.child(key).set(value);
    });

    dispatch({ type: 'SORTED', payload});
  }
};

export const isDeletingCategory = (payload) => {
  return {
    type: 'IS_DELETING_CATEGORY',
    payload
  };
};

export const categoryDeleted = (payload) => {
  return {
    type: 'CATEGORY_DELETED',
    payload
  }
};

export const addCategory = (payload) => {
  return dispatch => {
    let key = _categories.push().key;
    _categories.child(key).set(payload);
    dispatch({ type: 'CATEGORY_ADDED'});
  };
}

export const initializeDeleteCategory = (payload) => {
  let { tag, key } = payload;
  return dispatch => {
    dispatch(isDeletingCategory({
      status: 'DELETING',
      icon: 'glyphicon glyphicon-ok',
      details: 'Please wait...',
      link: '/'
    }));
    setTimeout(() => {
      _categories.orderByValue().equalTo(tag).on('value', (snap) => {
        let values = snap.val();
        _.map(values, (value, key) => {
          _categories.child(key).remove();
        })  
      });
      
      dispatch(categoryDeleted({
        status: 'DELETED',
        icon: 'glyphicon glyphicon-ok',
        details: `Successfully delete ${tag}`,
        link: '/'
      }));
    }, 4500);
  }
};

export const categoryDeleteWarning = (payload) => {
  return {
    type: 'CATEGORY_DELETE_WARNING',
    payload
  }
};

export const closeCategoryModal = () => {
  return {
    type: 'CLOSE_MODAL'
  }
}

export const updateCategories = (payload) => {
  let { key, name } = payload;
  return dispatch => {
    dispatch({ type: 'IS_UPDATING_CATEGORY'});
    _categories.child(key).set(name).then(((updated) => {
      dispatch({ type: 'CATEGORY_UPDATED'});
    }));
  }
}


export const isFetchingCategories = (payload) => {
  _categories.off();
  return {
    type: 'IS_FETCHING_CATEGORY',
    payload
  };
};

export const categoryFetchComplete = (payload) => {
  return {
    type: 'CATEGORY_FETCHING_COMPLETE',
    payload
  };
};

export const categoryFetchError = (payload) => {
  return {
    type: 'CATEGORY_FETCH_FAILED',
    payload
  };
};