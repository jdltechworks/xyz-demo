const Message = (state = {
  popup: false,
  details: {},
  warning: false,
  bulk: false
}, action) => {
  let { payload } = action;
  switch(action.type) {
    case 'OVERLAY_OPENED': return {
      ...state,
      popup: true
    }
    break;
    case 'OVERLAY_CLOSED': return {
      ...state,
      popup: false
    }
    case 'IS_BULK_UPDATE': return {
      ...state,
      bulk: true,
      warning: false
    }
    break;
    case 'IS_EXECUTING_ACTION': return {
      ...state,
      isExecuting: true,
      details: payload,
      warning: false
    }
    break;
    case 'IS_EXECUTING_WARNING': return {
      ...state,
      isExecuting: true,
      details: payload,
      warning: true
    }
    break;
    case 'ACTION_EXECUTED': return {
      ...state,
      isExecuting: false,
      details: payload
    }
    break;
    case 'FAILED_TO_EXECUTE_ACTION': return {
      ...state,
      isExecuting: false,
      failed: true,
      details: payload
    }
    break;
    default: return state;
  }
}

export default Message;