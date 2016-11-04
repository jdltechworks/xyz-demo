const Email = (state = {
  modal: false,
  isSent: false
}, action) => {
  switch(action.type) {
    case 'OPEN_MAILER': return {
      ...state,
      modal: true
    }
    break;
    case 'CLOSE_MAILER': return {
      ...state,
      modal: true
    }
    break;
    case 'IS_SENDING_EMAIL': return {
      ...state,
    }
    break;
    case 'EMAIL_SENT': return {
      ...state,
      success: true,
      message: action.payload
    }
    break;
    case 'MAILER_CLOSED': return {
      ...state,
      modal: false
    }
    break;
    default: return state;
  }
}

export default Email;