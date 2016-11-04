import _ from 'lodash';

const Auth = (state = {
  isLoggedIn: false,
  LogInFailed: false,
  message: {},
  credentials: {}
}, action) => {
  let { payload } = action;
  switch(action.type) {
    case 'IS_LOGGING_IN': return {
      ...state,
      isChecking: false,
      isLoggedIn: false,
      LogInFailed: false,
      message: action.payload,
      credentials: {}
    };
    break;
    case 'LOGIN_SUCCESS': return {
      ...state,
      isChecking: false,
      isLoggedIn: true,
      LogInFailed: false,
      message: action.payload,
      credentials: {}
    }
    break;
    case 'LOGIN_FAILED': return {
      ...state,
      isChecking: false,
      isLoggedIn: false,
      LogInFailed: true,
      message: action.payload,
      credentials: {}
    }
    break;
    case 'IS_LOGGING_OUT': return {
      ...state,
      isChecking: false,
      isLoggedIn: false,
      LogInFailed: false,
      message: action.payload,
      credentials: {}
    }
    break;
    case 'LOGGED_OUT': return {
      ...state,
      isChecking: false,
      isLoggedIn: false,
      LogInFailed: false,
      message: action.payload,
      credentials: {}
    }
    break;
    case 'IS_AUTHENTICATED':return {
      ...state,
      isChecking: false,
      isLoggedIn: true,
      LogInFailed: false,
      message: {},
      credentials: action.payload,
    }
    break;
    case 'IS_CHECKING_CREDENTIALS':return {
      ...state,
      isChecking: true,
      isLoggedIn: false,
      LogInFailed: false,
      message: {},
      credentials: {}
    }
    break;
    case 'SESSION_EXPIRED':return {
      ...state,
      isChecking: false,
      isLoggedIn: false,
      LogInFailed: true,
      message: action.payload,
      credentials: {}
    };
    break;
    default: return state;
  }
}

export default Auth;