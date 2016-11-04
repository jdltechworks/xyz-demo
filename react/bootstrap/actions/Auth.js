import API from '../config';
import { browserHistory } from 'react-router';

var collection = API.database();
const _users = collection
  .ref('/users');

export const SignIn = (payload) => {
  return {
    type: 'IS_LOGGING_IN',
    payload
  }
}

export const SignInFailed = (payload) => {
  return {
    type: 'LOGIN_FAILED',
    payload
  }
}

export const SignInSuccess = (payload) => {
  return {
    type: 'LOGIN_SUCCESS',
    payload
  }
}

export const isAuthenticated = (payload) => {
  return {
    type: 'IS_AUTHENTICATED',
    payload
  }
}

export const sessionExpired = (payload) => {
  return {
    type: 'SESSION_EXPIRED',
    payload
  };
}

export const isCheckingCredentials = (payload) => {
  return {
    type: 'IS_CHECKING_CREDENTIALS',
    payload
  };
}

export const LogOut = (payload) => {
  return dispatch => {
    dispatch(isLoggingOut({}));
    API.auth().signOut().then((data) => {
      dispatch(LoggedOut({}));
      if(_.includes(location.pathname, 'users')) {
        browserHistory.push('/login');
      }
    });
  };
}

export const isLoggingOut = (payload) => {
  return {
    type: 'IS_LOGGING_OUT',
    payload
  }
}

export const LoggedOut = (payload) => {
  return {
    type: 'LOGGED_OUT',
    payload
  }
}

export const checkCredentials = (payload) => {
   
  return dispatch => {

   if(!_.includes(location.pathname, 'users')) {
     return API
      .auth()
        .onAuthStateChanged((user) => {
            
          if(!_.includes(location.pathname, 'users')) {
            dispatch(isCheckingCredentials());
            if(_.isNull(user)) {
              browserHistory.push('/login');
              dispatch(sessionExpired({
              }));

            } else {
              let { uid } = user;
              _users.child(uid).on('value', (snap) => {
                let response = snap.val();
                if(!_.isNull(response)) {
                  let { email, password } = response;
                  dispatch(isAuthenticated({ email, password }));
                } else {
                  dispatch(isAuthenticated({user}));
                }
                  
              });
              if(_.eq(location.pathname, '/login')) {
                browserHistory.push('/dashboard');
              }
            }
          } else {
          }
      })
    } else{
      return API.auth().onAuthStateChanged((user) => {
        if(!_.isNull(user)) {
          let { uid } = user;
          _users.child(uid).on('value', (snap) => {
            let response = snap.val();
            if(!_.isNull(response)) {
              let { email, password } = response;
               dispatch(isAuthenticated({ email, password }));
            } else {
              dispatch(isAuthenticated({user}));
            } 
          });
        } else {
        }
      });
    }
  }
}

/**
 * Basic authentication
 */

export const Authenticate = (payload) => {
  let { username, password } = payload;
  return dispatch => {
    API.auth().signInWithEmailAndPassword(username, password)
    .then((response) => {
      let { email, uid } = response;

      _users.child(uid).on('value', (snap) => {
        if(_.isNull(snap.val())) {
          password = btoa(password);
          _users.child(uid).set({ email, password });
        }
      });

      dispatch(SignInSuccess({}));
    }).catch((error) => {
      let { code, message } = error;
      dispatch(SignInFailed({code, message}));
    });
  }
}