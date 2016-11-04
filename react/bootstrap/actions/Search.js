export const openSearch = () => {
  return {
    type: 'OPEN_SEARCH',
    payload: null
  }
};

export const closeSearch = () => {
  return {
    type: 'CLOSE_SEARCH',
    payload: null
  }
};

export const initializeKeyWordSearch = (payload) => {
  return dispatch => {
    dispatch(displaySearchResult(payload));
  }
}

export const displaySearchResult = (payload) => {
  return {
    type: 'DISPLAY_RESULTS',
    payload
  };
}