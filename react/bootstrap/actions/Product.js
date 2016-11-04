import API from '../config';
import _ from 'lodash';
import moment from 'moment';
import { product_collection } from './helpers';
import { browserHistory } from 'react-router';
import { reduxForm, Field } from 'redux-form';
import { Chance } from 'chance';
import { axios } from 'axios';
import jsonpack from 'jsonpack';

var collection = API.database();
const _products = collection
  .ref('/items');
const _projects = collection
  .ref('/projects');
const _releases = collection.ref('/release_items');
const _suggested_items = collection.ref('/suggested_items');
const _users = collection.ref('/users');
const _notes = collection.ref('/notes');
const _usage = collection.ref('/usage');

let sorted = false;
let lastQuery = '';
let lastFilterTags = {};
let filterProductsBy = '';
let products = [];
let productsPerPage = 3;
let lastProductPerPage = null;
let lastKeyPerPage = null;
let isEndOfProductsList = false;
let orderByKey = '_id';
let callReset = false;
let isStillFetching = false;

let currentDate = moment(Date.now());

// Always use this for pushing
Array.prototype.insertSorted = function (value, key) {
  if (!sorted) {
    var insertIdx = _.sortedIndexBy(this, value, key);
    this.splice(insertIdx, 0, value);
    return insertIdx;
  } else {
    for (var idx in this) {
      var current = this[idx];
      if (current[key] <= value[key]) {
        this.splice(idx, 0, value);
        return idx;
        break;
      }
    }
    this.push(value);
    return this.length - 1;
  }

  return -1;
}

export const getProductsBy = (query) => {
  isStillFetching = true;

  // Pagination
  if (!lastProductPerPage || !_.isUndefined(query)) {
    products = [];
    isEndOfProductsList = false;
    lastProductPerPage = null;
  }

  // Sorting
  let initialProducts = _products.orderByChild(orderByKey);
    
  if (!sorted) {
    initialProducts = initialProducts
      .limitToFirst(productsPerPage + (lastProductPerPage ? 1 : 0))
      .startAt(lastProductPerPage);
  } else {
    initialProducts = initialProducts
      .limitToLast(productsPerPage + (lastProductPerPage ? 1 : 0));
      // .startAt(lastProductPerPage);
    if (lastProductPerPage) {
      initialProducts = initialProducts.endAt(lastProductPerPage);
    }
  }

  return dispatch => {
    if (callReset) {
      dispatch(productsCount(0));
      callReset = false;
    }

    if (!_.isUndefined(query)) {
      dispatch(isFilteringProducts(products));
    } else {
      dispatch(isFetchingProducts(products));
    }

    initialProducts.once('value', (snapshot) => {
      let unsanitizedProducts = snapshot.val();
      let productsDone = snapshot.numChildren();

      if (typeof(query) == 'string') {
        lastQuery = query;
      } else if (query) {
        lastFilterTags = query;
      }

      var tmpLastKeyPerPage = lastKeyPerPage;
      var missed = 0;
      var removeInsertedFilter = false;
      // Our dispatching common method
      var dispatchProducts = () => {
        if (removeInsertedFilter) {
          delete lastFilterTags.availability[filterProductsBy];
        }

        // Determines the end of the list we're getting the same results
        if (tmpLastKeyPerPage == lastKeyPerPage) {
          isEndOfProductsList = true;
        }

        
        // products = _.sortedUniq(products);

        if (query) {
          dispatch(productsFilteringComplete(products));
        } else {
          dispatch(productsFetchComplete(products));
        }

        // Re-run the whole thing when found items are so few
        isStillFetching = false;
        if (missed >= productsPerPage / 2 && !isEndOfProductsList) {
          loadNextProducts()(dispatch);
        } else if (missed < productsPerPage / 2 || isEndOfProductsList) {
          // This is really wierd we can only have one query at time lols
          numOfProducts()(dispatch);
        }
      }

      _.map(unsanitizedProducts, (value, key) => {
        let found = true;
        let { projects } = value;

        // Skip the first one on the list should just be a dup
        if (key == tmpLastKeyPerPage) {
          productsDone--;
          return true;
        }

        // This is for tracking pagination
        if ((sorted ^ value[orderByKey] > lastProductPerPage) || lastProductPerPage == null) {
          lastKeyPerPage = key;
          lastProductPerPage = value[orderByKey];
        }

        // For archived
        if (filterProductsBy != 'ARCHIVED' && value.deleted_at) {
          productsDone--;
          missed++;
          return true;
        }

        // We really need this :D
        value._key = key;

        // Filter 'em with what's currently set for the page
        if (filterProductsBy) {
          if (!lastFilterTags.availability) {
            lastFilterTags.availability = {};
          }
          if (!lastFilterTags.availability[filterProductsBy]) {
            removeInsertedFilter = true;
            lastFilterTags.availability[filterProductsBy] = (product, category) => {
              return isStatus(product, category);
            }
          }
        }

        isProductIn(lastQuery, lastFilterTags, value).then((found) => {
          if (found) {
            // Do the actual inserting here because of the delay, grrr!
            var insertIdx = -1;
            if ((insertIdx = products.insertSorted(_.merge(value, {key, status: ''}), orderByKey)) != -1) {
              var currentProduct = products[insertIdx];

              // Actual data fetching
              if(!currentProduct.deleted_at) {
                // This will be current products default status
                currentProduct.status = 'AVAILABLE';

                if(projects) {
                  let projectsDone = Object.keys(projects).length;
                  _.map(projects, (project, _key) => {
                    _projects.child(_key).on('value', (snap) => {
                      let _startDate = snap.child('startDate').val();
                      let _endDate = snap.child('endDate').val();
                      let project = snap.val();

                      if(!_.isNull(_startDate)) {
                        currentProduct.project = project;

                        if(_.gte(currentDate, moment(new Date(_startDate))) && _.lte(currentDate, moment(new Date(_endDate)))) {
                          currentProduct.status = 'IN_LOCATION';
                        } else if(_.lte(currentDate, moment(new Date(_startDate)))) {
                          currentProduct.status = 'CHECKED_OUT';
                        }
                      }

                      projectsDone--;
                      if (!projectsDone) {
                        productsDone--;
                        if (!productsDone) {
                          dispatchProducts();
                        }
                      }
                    });
                  });

                  if (!projectsDone) {
                    productsDone--;
                    if (!productsDone) {
                      dispatchProducts();
                    }
                  }
                } else {
                  currentProduct.status = 'AVAILABLE';
                  productsDone--;
                  if (!productsDone) {
                    dispatchProducts();
                  }
                }
              } else {
                currentProduct.status = 'ARCHIVED';

                productsDone--;
                if (!productsDone) {
                  dispatchProducts();
                }
              }
            } else {
              console.log('Failed to insert to list');
            }
          } else {
            missed++;
            productsDone--;
            if (!productsDone) {
              dispatchProducts();
            }
          }
        });
      });

      if (!productsDone) {
        dispatchProducts();
      }
      
    });
  }
}


export const isProductIn = (query, filterTags, product) => {
  return new Promise((resolve, reject) => {
    var found = false;

    // For search string
    for (var x in product) {
      var prop = product[x];

      if (!prop) {
        prop = '';
      }
      prop = prop.toString();

      if (prop.match(new RegExp('.*' + _.escapeRegExp(query) + '.*', 'i'))) {
        found = true;
        break;
      }
    }

    if (found) {
      // For filter tags
      let categoryFiltersDone = 0;
      // Let's do the computation prior, this is s bad but we haveno choice
      for (let category in filterTags) {
        categoryFiltersDone += Object.keys(filterTags[category]).length;
      }

      for (let category in filterTags) {
        for (let categoryVal in filterTags[category]) { // query part
          let categoryValValue = filterTags[category][categoryVal];
          if (typeof(categoryValValue) == 'function') {
            categoryValValue(product, categoryVal).then((found) => {
              categoryFiltersDone--;
              if (!found || !categoryFiltersDone) {
                return resolve(found);
              }
            });
          } else if (product[category]) {
            let categoryValFound = false;
            for (let valueCategoryVal of product[category]) if (categoryVal == _.toUpper(valueCategoryVal)) {
              // This guy's category is found here too
              categoryValFound = true;
              break;
            }

            categoryFiltersDone--;
            if (!categoryValFound || !categoryFiltersDone) {
              return resolve(categoryValFound);
              break;
            }
          } else {
            return resolve(false);
          }
        }
      }

      if (!categoryFiltersDone) {
        return resolve(true);
      }
    } else {
      return resolve(false);
    }
  });
}

export const resetFetchingSettings = () => {
  if (isStillFetching) {
    return;
  }


  lastProductPerPage = null;
  lastKeyPerPage = null;
  orderByKey = '_id';
  sorted = false;
  callReset = true;
  isEndOfProductsList = false;

  lastQuery = '';
  lastFilterTags = {};
}

export const clearFilters = () => {
  lastQuery = '';
  lastFilterTags = {};
  return filterProducts('');
}

export const loadNextProducts = () => {
  return getProductsBy();
}

/**
 * Would either be a query string or an array of filterTags
 */
export const filterProducts = (query) => {
  return getProductsBy(query);
};

export const searchInProducts = (query) => {
  var initialProducts = _products.orderByChild('_id');

  return (dispatch) => {
    initialProducts.once('value', (snapshot) => {
      var unsanitizedProducts = snapshot.val();
      var productsDone = snapshot.numChildren();
      var filteredProducts = [];

      if (query) { 
        _.map(unsanitizedProducts, (product, key) => {
          isProductIn(query, {}, product).then((found) => {
            if (found) {
              filteredProducts.push(_.merge(product, { key }));
            }

            productsDone--;
            if (!productsDone) {
              dispatch({
                type: 'IS_PRODUCTS_SEARCHED',
                payload: filteredProducts
              });
            }
          });
        });
      } else {
        dispatch({
          type: 'IS_PRODUCTS_SEARCHED',
          payload: filteredProducts
        });
      }
    });
  }
};

export const fetchProducts = () => {
  filterProductsBy = '';
  resetFetchingSettings();
  return getProductsBy();
};

export const fetchCheckedOutProducts = () => {
  filterProductsBy = 'CHECKED OUT';
  resetFetchingSettings();
  return getProductsBy();
};

export const fetchAvailableProducts = () => {
  filterProductsBy = 'AVAILABLE';
  resetFetchingSettings();
  return getProductsBy();
};

export const fetchArchivedProducts = () => {
  filterProductsBy = 'ARCHIVED';
  resetFetchingSettings();
  return getProductsBy();
}

export const sortBy = (payload) => {
  sorted = !sorted;
  let { collection, type } = payload;
  orderByKey = type;
  lastProductPerPage = null;
  lastKeyPerPage = null;

  return dispatch => {
    if (!isEndOfProductsList) {
      getProductsBy()(dispatch);
    } else {
      products = _.sortBy(products, type);
      if(_.eq(sorted, true)) {
        products = _.reverse(products);
      }
      dispatch({ type:'SORT', payload: products, orderByKey, sorted});
    }

    // if(_.eq(sorted, false)) {
    //   dispatch({ type:'SORT', payload: _.sortBy(_collection, type)});
     
    // } else {
    //   dispatch({ type:'SORT', payload: _.reverse(_collection)});
    // }
    
  }
}

export const numOfProducts = () => {
  return dispatch => {
    _products.orderByChild('deleted_at').equalTo(null).on('value', (snap) => {
      var payload = snap.numChildren();
      if (filterProductsBy == 'ARCHIVED') {
        _products.on('value', (snap) => {
          payload = snap.numChildren() - payload;
          dispatch(productsCount(products.length + '/' + payload));
        });
      } else {
        dispatch(productsCount(products.length + '/' + payload));
      }
    });
  }
}

export const Reset = () => {
  return dispatch => {
    dispatch({type: 'RESET'});
  }
}

/**
 * Fetch single product
 */

export const fetchProduct = (payload) => {
  return dispatch => {
    let singleProduct = _products.orderByChild('_id').equalTo(parseInt(payload));
    let projectDetails = [];
    singleProduct.on('value', (snap) => {
      if(snap.val()) {
        let prod = snap.val();
         _.map(prod, (product, key) => {
          let { projects } = product;
          let _projectKeys = _.keys(projects);
          _.map(_projectKeys, (proj, index) => {

            _projects.child(proj).on('value', (snapshot) => {
              let projs = snapshot.val();
              projectDetails.push(projs);
            });
          });
          let projectCollection = _.compact(projectDetails);
          let recentProject = _.minBy(projectCollection, (o) => new Date() > new Date(o.endDate));
          
          if(!_.isUndefined(recentProject)) {
            _.merge(product, { recentProject });

            let { endDate, startDate } = recentProject;
              if(endDate) {
                let { status, deleted_at } = product;
                if(_.isUndefined(deleted_at)) {
                  let AVAILABLE = new Date() > new Date(endDate);
                  let CHECKED_OUT = new Date() < new Date(startDate);
                  let IN_LOCATION = new Date() >= new Date(startDate) && new Date() <= new Date(endDate);

                  if(IN_LOCATION) {
                  
                    product.status = 'IN LOCATION';
                  
                  } else if(CHECKED_OUT) {
                  
                    product.status = 'CHECKED OUT';
                  
                  } else if(AVAILABLE) {
                  
                    product.status = 'AVAILABLE';
                  
                  } else {
                    product.status = 'AVAILABLE';
                  }

                } else {
                  
                  product.status = 'ARCHIVED';

                }
              }
            } 
          dispatch(singleProductFetched(_.merge(product, { key })));
        });
      }
    });
  }
}

export const singleProductFetched = (payload) => {
  return {
    type: 'PRODUCT_FETCH_COMPLETED',
    payload
  }
}

/**
 * Reset firebase connection when page loads
 * @param  {object} payload [description]
 * @return {object}         [description]
 */
export const isFetchingProducts = (payload) => {
  _products.off('value');
  return {
    type: 'IS_FETCHING_PRODUCTS',
    payload
  }
}

export const isFetchingNotes = (payload) => {
  _notes.off();
  return {
    type: 'IS_FETCHING_NOTES',
    payload
  }
}

export const isFetchingProduct = (payload) => {
  _products.off('value');
  return {
    type: 'IS_FETCHING_PRODUCT',
    payload
  }
}

export const isFilteringProducts = (payload) => {
  return {
    type: 'IS_FILTERING_PRODUCTS',
    payload
  }
}

export const isFetchingUsers = (payload) => {
  _users.off();
  return {
    type: 'IS_FETCHING_USERS',
    payload
  }
}

export const productsFilteringComplete = (payload) => {
  
  return {
    type: 'IS_PRODUCTS_FILTERED',
    isEndOfProductsList,
    orderByKey,
    sorted,
    payload,
    hasFilters: !!(lastQuery || Object.keys(lastFilterTags).length)
  }
}

export const productsFetchComplete = (payload) => {
  
  return {
    type: 'PRODUCTS_FETCH_COMPLETED',
    isEndOfProductsList,
    orderByKey,
    sorted,
    payload,
    hasFilters: !!(lastQuery || Object.keys(lastFilterTags).length)
  }
}

export const usersFetchCompleted = (payload) => {
  return {
    type: 'USERS_FETCHED_COMPLETED',
    payload
  }
}

export const productsCount = (payload) => {
  return {
    type: 'PRODUCT_COUNT',
    payload
  }
}

export const noteFetchCompleted = (payload) => {
  return {
    type: 'NOTE_FETCH_COMPLETED',
    payload
  }
}

export const fetchFailed = (payload) => {
  return {
    type: 'FETCH_ERROR',
    payload
  }
}

export const isSearching = (payload) => {
  return {
    type: 'IS_SEARCHING',
    payload
  }
}

export const searchSuccess = (payload) => {
  return { 
    type: 'SEARCH_COMPLETED',
    payload
  }
}

export const searchFailed = (payload) => {
  return { 
    type: 'SEARCH_FAILED',
    payload
  };
}

export const loadProductId = (payload) => {
  return {
    type: 'LOAD_ID',
    payload
  };
}

export const executeProductSubmit = (payload) => {

  return dispatch => {
    dispatch(isSubmittingProduct({ 
      status: 'SAVING',
      icon: 'fa-spinner fa-spin',
      details: 'Please wait...',
      link: '/'
    }));
    setTimeout(() => {
      _products.push(payload).then((snap) => {
        if(snap) {
          let path = snap.path['o'][1];
          _products.on('child_added', (snapshot) => {
            if(snapshot) {
              dispatch(successProductSubmit({
                status: 'SAVED',
                icon: 'glyphicon glyphicon-ok',
                details: `${ snapshot.val().name } has been added to the inventory`,
                link: `/inventory/${snapshot.val()._id}`
              }));
              _products.off('child_added');
            }    
          });
          
        }
      });
      }, 4000);
  }
};

/*@todo Update failed */

export const initializeProductUpdate = (payload) => {
  let { productDetails } = payload;
  let { name, _id, key, items } = payload;
  return dispatch => {
    dispatch(isUpdatingProduct({
      status: 'UPDATING',
      icon: 'glyphicon glyphicon-ok',
      details: 'Please wait...',
      link: '/'
    }));    
    setTimeout(() => {
      collection.ref(`/items/${key}`).set(payload).then((data) => {
        dispatch(successProductUpdate({
          status: 'UPDATED',
          icon: 'glyphicon glyphicon-ok',
          details: `${ name } has been updated to the inventory`,
          link: `/inventory/${_id}`
        }));          
      });
    }, 4500);
  }
}

export const clearProducts = () => {
  return dispatch => {
    dispatch( { type: 'OFF' } );
  }
}

export const initializeAddtoProject = (payload) => {
  let { products, project } = payload;
  return dispatch => { 
    dispatch({ type: 'ADD_PRODUCT_TO_PROJECT',
      payload: {
        status: 'ADDING ITEMS TO PROJECT',
        icon: 'glyphicon glyphicon-ok',
        details: 'Please wait...',
      }
    })

    setTimeout(() => {
      _.map(products, (value, index) => {
         _projects.child(project).child('items').child(value).set(true);
         _products.child(value).child('projects').child(project).set(true);
      })

      dispatch(successProductUpdate({
          status: 'ITEMS ADDED',
          icon: 'glyphicon glyphicon-ok',
          details: `Items have beed added to the project`,
      }));
    }, 4500);
  }
}

export const isUpdatingProduct = (payload) => {
  console.log(payload)
  return {
    type: 'IS_UPDATING_PRODUCT',
    payload
  }
}

export const successProductUpdate = (payload) => {
  return {
    type: 'PRODUCT_UPDATED',
    payload
  }
};

export const isSubmittingProduct = (payload) => {
  return {
    type: 'IS_SUBMITTING_PRODUCT',
    payload
  };
};

export const successProductSubmit = (payload) => {
  return {
    type: 'PRODUCT_SUBMITTED',
    payload
  }
};

export const isReleasingProduct = (payload) => {
  return {
    type: 'IS_RELEASING_PRODUCT',
    payload
  };
};

export const isDeletingProduct = (payload) => {
  return {
    type: 'IS_DELETING_PRODUCT',
    payload
  };
};

export const isDeletingNote = (payload) => {
  return {
    type: 'IS_DELETING_NOTE',
    payload
  }
}

export const isDeletingProducts = (payload) => {
  let toDelete = [];
  return dispatch => {

    _.map(payload, (value, index) => {
      _products.child(value).on('value', (snap) => {
        toDelete.push(_.merge(snap.val(), { key: value }));
      });       
    });

    dispatch({ type: 'IS_DELETING_PRODUCTS', payload: toDelete });

  }
};

export const productDeleted = (payload) => {
  return {
    type: 'PRODUCT_DELETED',
    payload
  }
}

export const closeProductModal = () => {
  return {
    type: 'CLOSE_MODAL'
  }
}

export const InitializeProductDeletion = (payload) => {
  return {
    type: 'INITIALIZE_PRODUCT_DELETION',
    payload
  }
}

export const AddProductsToProjects = (payload) => {
  return {
    type: 'ADD_PRODUCTS_TO_PROJECTS',
    payload
  }
}

/**
 * Add one product to project
 */

export const addProductToProject = (payload) => {
  let { key, project } = payload;
  console.log(payload);
  return dispatch => {
    dispatch({ type: 'ADD_PRODUCT_TO_PROJECT',
      payload: {
        status: 'ADDING THIS PRODUCT TO PROJECT',
        icon: 'glyphicon glyphicon-ok',
        details: 'Please wait...',
      }
    });
    setTimeout(() => {
      _projects.child(project)
        .child('items')
        .child(key).set(true);

      _products.child(key)
        .child('projects')
        .child(project).set(true);

      dispatch({ type: 'PRODUCT_ADDED', payload: {
        status: 'PRODUCT ADDED',
        icon: 'glyphicon glyphicon-ok',
        details: 'Please wait...'
      }});
    }, 4000)
  }

}

/**
 * Suggest one product to project
 */
export const suggestProductToProject = (payload) => {
  let { project, key, credentials } = payload;
  return dispatch => {
    dispatch({
      type: 'ADD_PRODUCT_TO_PROJECT',
      payload: {
        status: 'SUGGESTING THIS PRODUCT TO PROJECT',
        icon: 'glyphicon glyphicon-ok',
        details: 'Please wait...'
      }
    });
    setTimeout(() => {
      _suggested_items.push({
        item: key,
        project: project,
        created_at: moment().format(),
        user: credentials
      }).then(res => {
        dispatch({ type: 'PRODUCT_ADDED', payload: {
          status: 'PRODUCT SUGGESTED',
          icon: 'glyphicon glyphicon-ok',
          details: 'Please wait...'
        }});
      }).catch(err => {
        dispatch({ type: 'PRODUCT_ADDED', payload: {
          status: 'ERROR',
          icon: 'glyphicon glyphicon-warning-sign',
          details: 'We encountered an error!'
        }});
      });
    }, 3000);

  }
}

export const initializeProductRelease = (payload) => {
  return {
    type: 'INITIALIZE_PRODUCT_RELEASE',
    payload
  }
}

export const productReleasedCompleted = (payload) => {
  return {
    type: 'PRODUCT_RELEASE_COMPLETED',
    payload
  }
}

// Note

export const initializeAddingNote = (payload) => {
  return {
    type: 'INITIALIZE_ADDING_NOTE',
    payload
  }
}

export const isAddingNotes = (payload) => {
  return {
    type: 'IS_ADDING_NOTES',
    payload
  }
}

export const addingNotesCompleted = (payload) => {
  return {
    type: 'ADDING_NOTES_COMPLETED',
    payload
  }
}

export const releaseProduct = (payload) => {
  let { product: { itemCount, key }, quantity, releaseDate } = payload;
  let releasedQty = [];
  return dispatch => {
    dispatch(initializeProductRelease({
      status: 'RELEASING ITEM',
      icon: 'glyphicon glyphicon-ok',
      details: 'Please wait...',
    }));
    
    setTimeout(() => {
    
    var updatedItemCount = parseInt(itemCount) - quantity;
    
    _products.child(key).child('itemCount').set(updatedItemCount);

      _releases.push({
        release_date: moment(new Date(releaseDate)).format(),
        quantity: quantity,
        item: key          
      }).then((res) => {
          var usage = (quantity / itemCount) * 100;

          _usage.push({
            date: moment(new Date(releaseDate)).format(),
            usage
          })
        
          dispatch(productReleasedCompleted({
            status: 'ITEMS RELEASED',
            icon: 'glyphicon glyphicon-ok',
            details: `${quantity} items has been released!`,
          }));
      });
      
      /**
       * Calculate item usage
       * @param  {Function} (resolve, reject)       [description]
       * @return {[type]}             [description]
       */
      
      new Promise((resolve, reject) => {
          _releases.orderByChild('item').equalTo(key).on('child_added', (snap) => {
            releasedQty.push(snap.child('quantity').val());
          })
          resolve(releasedQty);
      }).then((qty) => {
            let usage =   _.sum(qty) / parseFloat(itemCount)  * 100;
            _products.child(key)
              .child('usage')
              .set(_.round(usage));
            _products.child(key).child('updated_at').set(currentDate.format());
      });

    }, 2000);

  }
}

export const deleteProduct = (payload) => {
  
  return dispatch => {
    //Multiple delete
    if(_.isArray(payload)) {
      let deletedProducts = [];
      dispatch(InitializeProductDeletion({
        status: 'DELETING ITEMS',
        icon: 'glyphicon glyphicon-ok',
        details: 'Please wait...',
        link: '/'
      }));
      setTimeout(() => {
        _.map(payload, (result, index) => {
          let productsSnapshot = _products.child(result.key);
          productsSnapshot.on('value', (snap) => {
           _.map(snap.child('projects').val(), (value, key) => {
            _projects
              .child(key)
              .child('items')
              .child(result.key).remove();
           })
          });
          productsSnapshot.child('deleted_at').set(currentDate.format());
          products = _.reject(products, (product) => {return product._id == parseInt(result._id)})
          dispatch(productsFetchComplete(products));
        });

          
        _products.on('child_removed', (snap) => {
          deleteProducts.push(`${ snap.val().name } has been deleted to the inventory`);
        });

        dispatch(productDeleted({
          status: 'ITEMS DELETED',
          icon: 'glyphicon glyphicon-ok',
          details: deletedProducts,
          link: '/inventory/manage'
        }));

        _products.off();
      }, 4000);
    //Single delete
    } else {
      let { key, name, _id } = payload;
      let reference = collection.ref(`/items/${key}`);
      dispatch(InitializeProductDeletion({
        status: 'DELETING',
        icon: 'glyphicon glyphicon-ok',
        details: 'Please wait...',
        link: '/'
      }));
      reference.on('value', (snap) => {
        if(snap.child('projects')) {
          _.map(snap.child('projects').val(), (value, index) => {
            _projects.child(index).child('items').child(key).remove();
          });
        }
        
      });
      setTimeout(() => {
        reference.child('deleted_at').set(currentDate.format()).then((response) => {
          if(_.isUndefined(response)) {
            products = _.reject(products, (product) => {return product._id == parseInt(_id)})
            dispatch(productsFetchComplete(products));
            dispatch(productDeleted({
              status: 'DELETED',
              icon: 'glyphicon glyphicon-ok',
              details: `${ name } has been deleted to the inventory`,
              link: '/inventory/manage'
            }));
          } 
        });
      }, 4000);
    };
  }
}

export const fetchProjectsSelection = () => {
  let payload = [];
  return dispatch => {
    dispatch({ type: 'IS_FETCHING_PROJECT_OPTIONS' });
    _projects.on('value', (snap) => {
      snap.forEach((value) => {
        let activeProjects = !value.child('deleted_at').val() && _.gt(moment(new Date(value.child('endDate').val())), currentDate);
        if(activeProjects) {
          let name = value.child('name').val();
          let key = value.key;

          payload.push({ name, key });
        }
      });
      dispatch({ type: 'FETCH_PROJECT_OPTIONS_COMPLETE', payload });
    });
  }
};

export const addNote = (payload) => {
  let { note, key, user } = payload;
  return dispatch => {
    dispatch(initializeAddingNote({
      status: 'Adding note',
      icon: 'glyphicon glyphicon-ok',
      details: 'Please wait'
    }));
    _notes.push({ note, item_id: key, user: user}).then(response => {
      let { user } = payload;
      if(user) {
        fetch(`${process.env.MAILER_API}/notify`, { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }).then((res) => {
          return res.json();
        }).then((json) => {
          let { success } = json;

          dispatch(addingNotesCompleted({
            status: 'Note added!',
            icon: 'glyphicon glyphicon-ok',
            details: 'Note has been added for this product.',
          }));
          
        }).catch((error) => {
          dispatch(addingNotesCompleted({
            status: 'Error!',
            icon: 'glyphicon glyphicon-warning-sign',
            details: 'Note has not been added!',
          }));
        });
      } else {
        dispatch(addingNotesCompleted({
          status: 'Note added!',
          icon: 'glyphicon glyphicon-ok',
          details: 'Note has been added for this product.',
        }));
      }
    });
  }
}

export const removeNote = (payload) => {
  return dispatch => {
    dispatch(isDeletingNote(payload));
  }
}

export const initializeDeleteNote = (payload) => {
  return dispatch => {
    dispatch(InitializeProductDeletion({
      status: 'DELETING NOTES',
      icon: 'glyphicon glyphicon-ok',
      details: 'Please wait...',
    }));
    _notes.child(payload).remove().then(response => {
      dispatch(productDeleted({
        status: 'DELETED',
        icon: 'glyphicon glyphicon-ok',
        details: `Note has been deleted.`,
      }));
    }); 
  }
}

export const fetchNotes = (payload) => {
  let { key } = payload;           
  let noteReference = _notes;
  let notes = [];

  return dispatch => {
    dispatch(isFetchingNotes({}));
    noteReference.orderByChild('item_id').equalTo(key).on('value', snapshot => {
      notes = snapshot.val();
      dispatch(noteFetchCompleted(notes));
    });
  }
}

/**
 * this determines status by category, since we can do have multiple status per item because we have many projects
 */
export const isStatus = (product, status) => {
  return new Promise((resolve, reject) => {
    switch (status) {
      case 'AVAILABLE':
      case 'CHECKED OUT': 
      case 'IN LOCATION': 
      case 'ON HOLD':
        if (!product.projects && status == 'AVAILABLE') {
          return resolve(true);
        } else if (product.projects) {
          let projectsDone = Object.keys(product.projects).length;
          var foundInProj = false;
          _.map(product.projects, (value, key) => {
            _projects.child(key).on('value', (snapshot) => {
              var startDate = new Date(snapshot.child('startDate').val());
              var endDate = new Date(snapshot.child('endDate').val());
              var now = new Date();

              switch (status) {
                // We are changing this, always include AVAILABLE to every condition as we need to set this as default
                case 'AVAILABLE':
                  foundInProj = (now >= startDate && now <= endDate) || now < startDate;
                break;
                case 'IN LOCATION':
                case 'ON HOLD':
                  foundInProj = now >= startDate && now <= endDate;
                break;
                case 'CHECKED OUT':
                  foundInProj = now < startDate;
                break;
              }

              projectsDone--;
              if (foundInProj || !projectsDone) {
                if (status == 'AVAILABLE') {
                  foundInProj = !foundInProj;
                }
                resolve(foundInProj);
                return false;
              }
            });
          });

          if (!projectsDone) {
            if (status == 'AVAILABLE') {
              foundInProj = !foundInProj;
            }
            return resolve(foundInProj);
          }
          
        } else {
          return resolve(false);
        }
      break;
      case 'SUGGESTED':
        _suggested_items.orderByChild("item").equalTo(product._key).limitToFirst(1).on('value', (snapshot) => {
          resolve(!!snapshot.numChildren());
          return false;
        });
      break;
      case 'ARCHIVED':
        return resolve(!!product.deleted_at);
      break;
    }
  });
}

export const unPackSharedProduct = (payload) => {
  let { data } = payload;
  let unserialized = atob(data);
  let unpacked = jsonpack.unpack(unserialized)

  return dispatch => {
    dispatch(isUnpackingSharedProduct(null));
    dispatch(unPackingCompleted(unpacked));
  }
}

export const isUnpackingSharedProduct = (payload) => {
  return {
    type: 'UNPACKING_SHAREPRODUCT',
    payload: null
  }
}

export const unPackingCompleted = (payload) => {
  return {
    type: 'UNPACKING_COMPLETED',
    payload
  }
}