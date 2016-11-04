

export const openPopUp = (type, payload) => {
  return dispatch => {
    dispatch({ type: 'OVERLAY_OPENED'})
    dispatch({type, payload});
  }
}

export const closePopUp = (payload) => {
  return {
    type: 'OVERLAY_CLOSED',
    payload
  }
}