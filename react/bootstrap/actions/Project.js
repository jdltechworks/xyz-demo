import API from '../config';
import _ from 'lodash';
import moment from 'moment';
import jsonpack from 'jsonpack';

var collection = API.database();
const _products = collection
  .ref('/items');
const _projects = collection
  .ref('/projects');
const _suggested_items = collection
  .ref('/suggested_items');
const _releases = collection.ref('/release_items');
const _users = collection.ref('/users');
const _notes = collection.ref('/notes');
const _usage = collection.ref('/usage');

let currentDate = moment(Date.now());
let lastQuery = '';
let lastFilterTags = {};
let filterProjectsBy = '';

String.prototype.findQuery = function (query) {
  return this.match(new RegExp('.*' + _.escapeRegExp(query) + '.*', 'i'));
}

export const isFetchingProject = () => {
  _projects.off();
  _products.off();
  return {
    type: 'IS_FETCHING_SINGLE_PROJECT',
    payload: {}
  };
}

export const isFetchingProjects = () => {
  _projects.off();
  return {
    type: 'IS_FETCHING_PROJECTS',
    payload: []
  };
}

export const fetchNumOfProjects = () => {
  let normalized = [];
  let currentProjects = null;
  let now = new Date()
  return dispatch => {
    _projects.once('value', (snap) => {

      _.map(snap.val(), (project, key) => (
        normalized.push(_.merge(project, {key}))
      ));
      currentProjects = _.filter(normalized, (o) => {
        return !o.deleted_at && (new Date(o.startDate) <= now && new Date(o.endDate) > now);
      });
      
        dispatch({ type: 'ACTIVE_PROJECT_COUNT', payload: _.size(currentProjects) });
    }); 
  }; 
}

export const setActiveCount = (payload) => {
  return {
    type: 'ACTIVE_PROJECT_COUNT',
    payload
  }
}

export const getProjectsBy = (query) => {
  let filteredProjects = [
    { name: 'ADD',
      _id: '/projects/create', 
      street: null, 
      suburb: null, 
      created_at: null, 
      updated_at: null, 
      startDate: null, 
      endDate: null
    }];

  let currentProjects = null;
  var removeInsertedFilter = false;

  return dispatch => {
    new Promise((resolve, reject) => {
      dispatch(isFetchingProjects({}));

      _projects.on('value', (snap) => {
        let projectsDone = snap.numChildren();
        var withItems = [];
        _.map(snap.val(), (project, key) => {

          project = { products: [], ...project };

          let { products: details, items } = project;

          if( items ) {
            var projectDetailsDone = Object.keys(items).length;
            _.map(items, (product, productKey) => {
              _products.orderByKey().equalTo(productKey).on('value', (snap) => {

                _.map(snap.val(), (value, key) => {
                  details.push(_.merge(value, {key}))
                });

                projectDetailsDone--;
                if (!projectDetailsDone) {
                  withItems.push(_.merge(project, {key}));
                  projectsDone--;
                  if (!projectsDone) {
                    return resolve(withItems);
                  }
                }
              });
            });
          } else {
            withItems.push(_.merge(project, {key}));
            projectsDone--;
            if (!projectsDone) {
              return resolve(withItems);
            }
          }
        });
      });
    }).then((withItems) => {
      return new Promise((resolve, reject) => {

        // Filtering Process
        if (typeof(query) == 'string') {
          lastQuery = query;
        } else if (query) {
          lastFilterTags = query;
        }

        // Filter 'em with what's currently set for the page
        if (filterProjectsBy) {
          if (!lastFilterTags.status) {
            lastFilterTags.status = {};
          }
          if (!lastFilterTags.status[filterProjectsBy]) {
            removeInsertedFilter = true;
            lastFilterTags.status[filterProjectsBy] = 1;
          }
        }

        var withItemsDone = withItems.length;
        _.map(withItems, (project) => {
          doesProjectHave(lastQuery, lastFilterTags, project).then((found) => {
            if (found) {
              filteredProjects.push(project);

              withItemsDone--;
              if (!withItemsDone) {
                return resolve(filteredProjects);
              }
            } else {
              withItemsDone--;
              if (!withItemsDone) {
                return resolve(filteredProjects);
              }
            }
          });
        });
      });
    }).then((filteredProjects) => {
      if (removeInsertedFilter) {
        delete lastFilterTags.status[filterProjectsBy];
      }

      dispatch(fetchProjectItemsComplete(filteredProjects));
    });


  };
}

export const doesProjectHave = (query, filterTags, project) => {
  return new Promise((resolve, reject) => {
    // For search string
    var found = false;
    for (var x in project) {
      var prop = project[x];

      if (prop instanceof Array) {
        for (var propSubKey in prop) if (typeof(prop[propSubKey]) == 'object') {
          // tmp += JSON.stringify(prop[propSubKey]);
          // This is done to make the code more efficient
          for (var key in prop[propSubKey]) {
            if (prop[propSubKey][key].toString().findQuery(query)) {
              found = true;
              break;
            }
          }
          if (found) {
            break;
          }
        }
      }

      if (found) {
        break;
      }

      if (!prop) {
        prop = '';
      }
      prop = prop.toString();

      if (prop.findQuery(query)) {
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
          if (categoryValValue == 1) {
            categoryValValue = isProjectStatus;           
          }
          
          if (typeof(categoryValValue) == 'function') {
            categoryValValue(project, categoryVal).then((found) => {
              categoryFiltersDone--;
              if (!found || !categoryFiltersDone) {
                return resolve(found);
              }
            });
          } else {
            let categoryValFound = false;

            for (let projectItemKey in project.products) {
              var projectItem = project.products[projectItemKey];
              
              if (projectItem[category]) {
                for (let valueCategoryVal of projectItem[category]) if (categoryVal == _.toUpper(valueCategoryVal)) {
                  categoryValFound = true;
                  break;
                }
                if (categoryValFound) {
                  break;
                }
              }
            }

            categoryFiltersDone--;
            if (!categoryValFound || !categoryFiltersDone) {
              return resolve(categoryValFound);
            }
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
  lastQuery = '';
  lastFilterTags = {};
}

export const fetchArchivedProjects = () => {
  filterProjectsBy = 'ARCHIVED';
  resetFetchingSettings();
  return getProjectsBy();
}

export const fetchActiveProjects = () => {
  filterProjectsBy = 'ACTIVE';
  resetFetchingSettings();
  return getProjectsBy();
};

export const fetchAllProjects = () => {
  filterProjectsBy = '';
  resetFetchingSettings();
  return getProjectsBy();
};

export const fetchUpcomingProjects = () => {
  filterProjectsBy = 'UPCOMING';
  resetFetchingSettings();
  return getProjectsBy();
};

export const searchInProjects = (query) => {
  var initialProjects = _projects.orderByChild('_id');

  return (dispatch) => {
    initialProjects.once('value', (snapshot) => {
      var unsanitizedProjects = snapshot.val();
      var projectsDone = snapshot.numChildren();
      var filteredProjects = [];

      if (query) { 
        _.map(unsanitizedProjects, (project, key) => {
          doesProjectHave(query, {}, project).then((found) => {
            if (found) {
              filteredProjects.push(_.merge(project, { key }));
            }

            projectsDone--;
            if (!projectsDone) {
              dispatch({
                type: 'IS_PROJECTS_SEARCHED',
                payload: filteredProjects
              });
            }
          });
        });
      } else {
        dispatch({
          type: 'IS_PROJECTS_SEARCHED',
          payload: filteredProjects
        });
      }
    });
  }
};

export const isProjectStatus = (project, status) => {
  return new Promise((resolve, reject) => {
    var now = new Date();
    var startDate = new Date(project.startDate);
    var endDate = new Date(project.endDate);
    let { deleted_at } = project;
    switch (status) {
      case 'AVAILABLE':
        return resolve((now >= startDate && now <= endDate) || now < startDate);
        break;
      case 'IN LOCATION': 
      case 'ON HOLD':
        return resolve(now >= startDate && now <= endDate);
        break;
      case 'CHECKED OUT': 
        return resolve(now < startDate);
        break;
      break;
      case 'ACTIVE':
        return resolve(!deleted_at && (startDate <= now && endDate > now));
        break;
      case 'UPCOMING':
        return resolve(!deleted_at && (startDate > now && (_.eq(project.endDate, null) || endDate > now)));
        break;
      case 'SUGGESTED':
        var productsDone = project.products.length;
        _.map(project.products, (product, key) => {
          _suggested_items.orderByChild("item").equalTo(product.key).limitToFirst(1).on('value', (snapshot) => {
            var productFound = !!snapshot.numChildren();

            productsDone--;
            if (productFound || !productsDone) {
              resolve(productFound);
              return false;
            }
          });
        });
      break;
      case 'ARCHIVED':
        return resolve(deleted_at);
      break;
    }
  });
};

export const fetchProject = (payload) => {
  let withItems = {};
  let normalized = [];
  return dispatch => {
    dispatch(isFetchingProject());
    return new Promise((resolve, reject) => {
      _projects
        .orderByChild('_id')
        .equalTo(parseInt(payload))
        .on('value', (snap) => {
          _.map(snap.val(), (value, key) => {
            let { items, startDate, endDate, deleted_at, status } = value;
            if(_.isUndefined(status)) {
              if(deleted_at) {
                status = 'ARCHIVED';
              } else {
                status = 'NOT_SELECTED'
              }
            }
            items = _.keys(items);
            normalized.push(_.merge(value, { key, items, status }));
          });
          normalized[0] = { products: [], ...normalized[0] };

          let { products: details, items } = normalized[0];
          _.map(items, (prod, index) => {
            _products.child(prod).once('value', (snap) => {
              details.push(_.merge(snap.val(), { key: prod }));
            });
          });

          setTimeout(() => {
            dispatch(singleProjectFetchComplete(normalized[0]));
          }, 1500);
          resolve(normalized[0]);
        });
      });
  }
}

export const singleProjectFetchComplete = (payload) => {
  return {
    type: 'FETCH_SINGLE_PROJECT_COMPLETE',
    payload
  };
}

export const projectFetchComplete = (payload) => {
  return {
    type: 'PROJECTS_FETCH_COMPLETED',
    payload
  };
}

export const fetchProjectItems = (payload) => {
  let _payload = _.clone(payload);
  let normalized = [];
  return dispatch => {
    dispatch({type: 'FETCHING_PROJECT_ITEMS', payload: []});
    
    _.map(_payload, (project) => {
      
      project = { products: [], ...project };
      
      let { products: details, items } = project;

      if( items ) {
        _.map(items, (product, key) => {
          _products.orderByKey().equalTo(key).on('value', (snap) => {
            _.map(snap.val(), (value, key) => details.push(_.merge(value, {key})));
          });
        });
      }
      normalized.push(project);

    });
    dispatch(fetchProjectItemsComplete(normalized));
  }
}

export const fetchProjectItemsComplete = (payload) => {
  return {
    type: 'PROJECT_ITEMS_FETCH_COMPLETE',
    payload
  }
};

export const getProjectDetails = (payload) => {
  let { project_id, product_id } = payload;
  let project_details = collection.ref(`/projects/${project_id}`);
  return dispatch => {
    project_details.on('value', (snap) => {
      if(_.includes(snap.val().items, product_id)) {
        dispatch(AlreadyInProjects({
          payload: 'Item is already in this project!'
        }))
      } else {
        dispatch(confirmAddtoProject({ project: snap.val(), product_id}));
      }
    });
  }
}

export const AlreadyInProjects = (payload) => {
  return {
    type: 'ALREADY_PROJECT',
    payload
  }
}

export const cancelAddProject = (payload) => {
  return {
    type: 'CANCEL_ADD_TO_PROJECT',
    payload
  }
}


export const confirmAddtoProject = (payload) => {
  return {
    type: 'CONFIRM_ADD_TO_PROJECT',
    payload
  }
}

export const projectInitialValue = (payload) => {
  return dispatch => {
    dispatch(initializingProjectValue(payload));
  };
};

export const initializePartialProjectUpdate = (payload, prevItems) => {
  
  let { name, _id, key, items } = payload;
  let projectDetails = _.omit(payload, ['key', 'items', 'status', 'products']);

  return dispatch => {
      return _projects.child(key).set(projectDetails).then((data) => {
        /**
         * Remove ommited items in project
         * @param  {[type]} var i in prevItems [description]
         * @return {[type]}     [description]
         */
        _.map(prevItems, (value, index) => {
          if(!_.includes(items, value)) {
            _products
              .child(value)
                .child(`projects/${key}`).remove();           
          }
        });
        /**
         * Append items to project
         * @param  {[type]}
         * @return {[type]}     [description]
         */

        _.map(items, (value, index) => {
          _projects.child(key)
            .child('items')
              .child(value)
                .set(true);
          _products
            .child(value)
              .child('projects')
                .child(key).set(true);         
        });
        
    });
  }
}

export const initializeSubmitProject =  (payload) => {
  let { _id, name, items } = payload;
  let newProject = _.omit(payload, 'items');
  return dispatch => {
    dispatch(isSubmittingProject({
      status: 'SAVING',
      icon: 'fa-spinner fa-spin',
      details: 'Please wait...',
      link: '/'
    }));
    setTimeout(() => {
      _projects.push(newProject).then((snap) => {
        return snap.path['o'];
      }).then((path) => {
        let _path = _.toString(path).replace(',', '/');
        let projectItems = collection.ref(`${_path}/items`);
        _.map(items, (value, key) => {
          projectItems.child(value).set(true);
          _products
            .child(value)
            .child('projects')
            .child(path[1]).set(true);
        });


        dispatch(ProjectSubmitted({
          status: 'SAVED',
          icon: 'glyphicon glyphicon-ok',
          details: `${ name } has been added to projects`,
          link: `/projects/${_id}`
        }));
        dispatch(fetchNumOfProjects());
      });
    }, 4000);

  }
};

export const isSubmittingProject = (payload) => {
  return {
    type: 'IS_SUBMITTING_PROJECT',
    payload
  }
};

export const ProjectSubmitted = (payload) => {
  return {
    type: 'PROJECT_SUBMITTED',
    payload
  }
}

export const isDeletingProduct = (payload) => {
  return {
    type: 'IS_DELETING_PRODUCT',
    payload
  }
}

export const isDeletingProject = (payload) => {   
  return {    
     type: 'IS_DELETING_PROJECT',    
     payload   
  }   
 }

export const initializeProjectDelete = (payload) => {
  let { project: { key, items } } = payload;
  return dispatch => {
    dispatch({ 
      type: 'INITALIZING_PROJECT_DELETE',
      payload: {
        status: 'ADDING PROJECT TO ARCHIVE',
        icon: 'fa-spinner fa-spin',
        details: 'Please wait...',
        link: '/' 
    }});
    setTimeout(() => {
      _projects.child(key).child('deleted_at').set(moment(new Date()).format()).then((response) => {
        if(_.isUndefined(response)) {
          dispatch({ 
            type: 'PROJECT_DELETED',
            payload: {
              status: 'PROJECT ADDED TO ARCHIVE',
              icon: 'glyphicon glyphicon-ok',
              details: 'Please wait...',
              link: '/' 
          }});
          dispatch(fetchNumOfProjects());
        }
      }).catch((err) => {
        dispatch({ 
          type: 'PROJECT_DELETE_FAILED',
          payload: {
            status: 'PROJECT DELETE ERROR',
            icon: 'glyphicon-warning-sign',
            details: 'Please wait...',
            link: '/' 
        }});
      });

    }, 3000);
  }
}

export const initializeProductRemove = (payload) => {
  let { project: { key }, productKey } = payload;
  return dispatch => {
    dispatch({ 
      type: 'INITALIZING_PRODUCT_REMOVE',
      payload: {
        status: 'DELETING ITEM',
        icon: 'fa-spinner fa-spin',
        details: 'Please wait...',
        link: '/'
    }});
    setTimeout(() => {
      _projects.child(key).child('items').child(productKey).remove();
      _products.child(productKey).child('projects')
        .child(key)
        .remove().then((response) => {
          if( _.isUndefined(response) ) {
             dispatch({ 
              type: 'PRODUCT_REMOVED',
              payload: {
                status: 'ITEM REMOVED',
                icon: 'glyphicon glyphicon-ok',
                details: 'Please wait...',
                link: '/' 
            }});           
          }
        }).catch((err) => {
          dispatch({ 
            type: 'PROJECT_DELETED',
            payload: {
              status: 'PRODUCT DELETE ERROR',
              icon: 'glyphicon-warning-sign',
              details: 'Please wait...',
              link: '/' 
          }});
        });

    }, 3000);
  }
}

export const closeModal = (payload) => {
  return {
    type: 'CLOSE_MODAL'
  };
};


export const initializeProjectUpdate = (payload, prevItems) => {
  let { name, _id, key, items } = payload;
  let projectDetails = _.omit(payload, ['key', 'items', 'status', 'products']);

  return dispatch => {

    dispatch(isUpdatingProject({
      status: 'UPDATING',
      icon: 'glyphicon glyphicon-ok',
      details: 'Please wait...',
      link: '/'
    }));
    setTimeout(() => {
      _projects.child(key).set(projectDetails).then((data) => {
        /**
         * Remove ommited items in project
         * @param  {[type]} var i in prevItems [description]
         * @return {[type]}     [description]
         */
        _.map(prevItems, (value, index) => {
          if(!_.includes(items, value)) {
            _products
              .child(value)
                .child(`projects/${key}`).remove();           
          }
        });
        /**
         * Append items to project
         * @param  {[type]}
         * @return {[type]}     [description]
         */

        _.map(items, (value, index) => {
          _projects.child(key)
            .child('items')
              .child(value)
                .set(true);
          _products
            .child(value)
              .child('projects')
                .child(key).set(true);         
        });
        
        dispatch(successProjectUpdate({
          status: 'UPDATED',
          icon: 'glyphicon glyphicon-ok',
          details: `Project ${name} has been updated`,
          link: `/projects/${_id}`
        }));
      });
    }, 3000);
  }
}

export const isUpdatingProject = (payload) => {
  return {
    type: 'IS_UPDATING_PROJECT',
    payload
  }
}

export const successProjectUpdate = (payload) => {
  return {
    type: 'PROJECT_UPDATED',
    payload
  }
};

/**
 * Would either be a query string or an array of filterTags
 */
export const filterProjects = (query) => {
  return getProjectsBy(query);
};


export const isSelectingItems = () => {
  return {
    type: 'IS_SELECTING_ITEMS'
  }
}

export const setProjectStatus = (key, status) => {
  return dispatch => {
    _projects
      .child(key)
      .child('status').set(status);
  }
}

export const quickAddProducts = (payload) => {
  return {
    type: 'QUICK_ADD',
    payload
  };
}

export const closequickAdd = (payload) => {
  return {
    type: 'QUICK_ADD_CLOSE',
    payload
  };
}

export const unPackSharedProject = (payload) => {
  let { data } = payload;
  let unserialized = atob(data);
  let unpacked = jsonpack.unpack(unserialized)

  return dispatch => {
    dispatch(isUnpackingSharedProject(null));
    dispatch(unPackingCompleted(unpacked));
  }
}

export const isUnpackingSharedProject = (payload) => {
  return {
    type: 'UNPACKING_SHAREPROJECT',
    payload: null
  }
}

export const unPackingCompleted = (payload) => {
  return {
    type: 'UNPACKING_COMPLETED',
    payload
  }
}

export const isReleasingProjectProducts = (payload) => {
  return {
    type: 'IS_RELEASING_PROJECT_PRODUCTS',
    payload
  }
}

export const projectProductsReleased = (payload) => {
  return {
    type: 'PROJECT_PRODUCTS_RELEASED',
    payload
  }
};

export const initializeProjectProductsRelease = (payload) => {
  let products = _.omit(payload, 'releaseDate');
  let { releaseDate } = payload;
  let releasedQty = [];
  let allSelectedProducts = [];
  return dispatch => {
    /**
     * Subtract itemCount
     * @param  {[type]} products [description]
     * @param  {[type]} (value,  key           [description]
     * @return {[type]}          [description]
     */
    dispatch(releaseProductProjects({
      initRelease: true,
      msg: 'RELEASING ITEMS PLEASE WAIT'
    }));

    let getProdDetails = new Promise((resolve, reject) => {
      _.map(products, (value, key) => {
        _products.child(key).once('value', (snap) => {
          allSelectedProducts.push({ key, itemCount: snap.val().itemCount - parseInt(value), quantity: parseInt(value)});
        });
      });
      setTimeout(() => resolve(allSelectedProducts), 300);
    });

    let getAllReleasedProducts = new Promise((resolve, reject) => {
      let releasedProducts = [];
      _.map(products, (value, key) => {
        _releases.orderByChild('item').equalTo(key).once('value', (snap) => {
          releasedProducts.push(snap.val());
        });
      });

      setTimeout(()=>resolve(releasedProducts), 300);
    });

    return Promise.all([getProdDetails, getAllReleasedProducts]).then((value) => {
      let prods = value[0];
      let releasedGroup = value[1];
        _.map(prods, (value) => {
          let { quantity, itemCount, key } = value;
          let usage = (quantity / itemCount) * 100;
          _products.child(key).child('itemCount').set(itemCount);
          _releases.push({quantity, item: key, release_date: moment(new Date(releaseDate)).format()});
          _usage.push({
            date: moment(new Date(releaseDate)).format(),
            usage
          })
        });
        _.map(releasedGroup, (a, k) => {
          let arr = [];
          _.map(a, (v, _k) => {
            let { quantity, item } = v;
            arr.push({quantity, item});
          });
          let withKeys = _.groupBy(arr, 'item');
        });
        dispatch(projectProductsReleased({
          initRelease: false,
          msg: 'ITEMS RELEASED'
        }));
    }, reason => console.log(reason));


  };
};

export const releaseProductProjects = (payload) => {
  return {
    type: 'RELEASING_PROJECT_PRODUCTS',
    payload
  }
}

export const closeReleaseModal = (payload) => {
  return {
    type: 'CLOSE_RELEASE_MODAL',
    payload: null
  }
}
