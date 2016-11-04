import API from '../config';
import _ from 'lodash';
import moment from 'moment';
import { Chance } from 'chance';
import firebase from 'firebase';

var collection = API.database();
const _products = collection.ref('items');
const _projects = collection
  .ref('/projects');
const _releases = collection.ref('/release_items');
const _suggested_items = collection.ref('/suggested_items');
const _users = collection.ref('/users');
const _notes = collection.ref('/notes');


export const fetchUsers = () => {
  let users = [];
  return dispatch => {
    new Promise((resolve, reject) => {
      dispatch(isFetchingUsers({}));
      _users.on('value', (snapshot) => {
        snapshot.forEach((snap) => {
          let user = snap.val();
          let key = snap.key;
          users.push(_.merge(user, { key }));
        });
        resolve(users);
      });
      
      
    }).then((sanitizedUsers) => {
      setTimeout(()=>dispatch(usersFetchComplete(sanitizedUsers)), 500);
    });
     
  }
}

export const isDeletingUser = (payload) => {
  return {
    type: 'IS_DELETING_USER',
    payload
  };
};

export const initializeDeleteUser = (payload) => {
  let { user: { key, email, password }, credentials } = payload;
  let users = [];
  return dispatch => {
    dispatch(deletingUser({
      status: 'DELETING',
      icon: 'fa-spinner fa-spin',
      details: 'Please wait...',
    }));
    setTimeout(() => {
      _users.child(key).remove();
      password = atob(password);
      API.auth().signInWithEmailAndPassword(email, password).then((user) => {
        user.delete();
        credentials.password = atob(credentials.password);
        API.auth().signInWithEmailAndPassword(credentials.email, credentials.password).then((reloggedInUser) => {
          let { email } = reloggedInUser;
          credentials.password = btoa(credentials.password);
        });

      });
      dispatch(userDeleted({
        status: 'USER',
        icon: 'glyphicon glyphicon-ok',
        details: 'Successfully deleted user email',
      }));
      new Promise((resolve, reject) => {
        dispatch(reloadingUsers({}));
        _users.on('value', (snapshot) => {
          snapshot.forEach((snap) => {
            let user = snap.val();
            let key = snap.key;
            users.push(_.merge(user, { key }));
          });
          resolve(users);
        });
        
        
      }).then((sanitizedUsers) => {
        setTimeout(()=>dispatch(usersReloaded(sanitizedUsers)), 500);
      });
    }, 3500);
  }
}

export const deletingUser = (payload) => {
  return {
    type: 'DELETING_USER',
    payload
  }
};

export const reloadingUsers = (payload) => {
  return { 
    type: 'REFRESHING_LIST',
    payload
  }
};

export const usersReloaded = (payload) => {
  return { 
    type: 'USER_LIST_REFRESHED',
    payload
  }
};

export const userDeleted = (payload) => {
  return {
    type: 'USER_DELETED',
    payload
  };
};

export const isFetchingUsers = (payload) => {
  return {
    type: 'IS_FETCHING_USERS',
    payload
  };
}

export const usersFetchComplete = (payload) => {
  return {
    type: 'USERS_FETCH_COMPLETED',
    payload
  }
}


export const isFetchingUser = (payload) => {
  return {
    type: 'IS_FETCHING_USER',
    payload
  }
}

export const singleUserFetched = (payload) => {
  return {
    type: 'USER_FETCH_COMPLETED',
    payload
  }
}



export const initializeSubmitUser =  (payload) => {
  let { _id, firstName, lastName, email, password, credentials } = payload;
  return dispatch => {
    let user_id = new Chance();
    let natural = user_id.natural({min: 0, max: 99999});
    payload._id = natural;

  	dispatch(isSubmittingUser({
      status: 'SAVING',
      icon: 'fa-spinner fa-spin',
      details: 'Please wait...',
    }));

    setTimeout(() => {
    	API.auth().createUserWithEmailAndPassword(email, password)
    	.then((response) => {
        let { uid } = response;
       return uid;
	    }).then((uid)=>{
        password = btoa(password);
        _users.child(uid).set({ email, password }).then((response) => {
          dispatch({ type: 'ADD_USER_SUCCESS', 
            payload: {
            status: 'SUCCESS',
            icon: 'glyphicon glyphicon-ok',
            message: 'Successfully added user'
          }});       
        });
        //dispatch({ type: 'IS_AUTHENTICATED', credentials});
        API.auth().signOut().then((data) => {
          credentials.password = atob(credentials.password);
          API.auth().signInWithEmailAndPassword(credentials.email, credentials.password).then((reloggedInUser) => {
          });
        });
      }).catch((error) => {
	      let { code, message } = error;
	      dispatch(AddUserFailed({code, message, status: "FAILED", icon: 'glyphicon glyphicon-warning-sign'}));
	    });
    }, 4000);
  }
};

export const isSubmittingUser = (payload) => {
  return {
    type: 'IS_SUBMITTING_USER',
    payload
  }
};


export const AddUserFailed = (payload) => {
  return {
    type: 'ADD_USER_FAILED',
    payload
  }
}

export const AddUserSuccess = (payload) => {
  console.log(payload);
  return {
    type: 'ADD_USER_SUCCESS',
    payload
  }
}

export const closeModal = () => {
  return {
    type: 'CLOSE_MODAL'
  }
}

