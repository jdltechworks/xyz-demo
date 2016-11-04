const Search = (state = {
  opened: false,
  result: []
}, action) => {
  let { type, payload } = action;
  switch(type){
    case 'OPEN_SEARCH': return {
      ...state,
      opened: true
    };
    break;
    case 'CLOSE_SEARCH': return {
      ...state,
      opened: false
    };
    break;
    case 'DISPLAY_RESULTS': return {
      ...state,
      opened: true,
      result: action.payload
    };
    break;
    default: return state;
  }
};

export default Search;