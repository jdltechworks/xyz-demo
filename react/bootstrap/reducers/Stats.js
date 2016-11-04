

const Stats = (state = {
  isGettingOverAllUsage: false,
  overAllUsage: 0,
  usageOverTime: []
}, action) => {
  let { type, payload, usage } = action;
  switch(type) {
    case 'INITIALIZE_OVERALL_USAGE_CALCULATION': return {
      ...state,
      overAllUsage: 0,
      isGettingOverAllUsage: true      
    };
    break;
    case 'IS_CALCULATING_RELEASED_ITEMS': return {
      ...state,
      overAllUsage: 0,
      isGettingOverAllUsage: true
    };
    break;
    case 'IS_CALCULATING_REMAINING_ITEMS': return {
      ...state,
      isGettingOverAllUsage: true
    };
    break;
    case 'IS_CALCULATING_REMAINING_ITEMS': return {
      ...state,
      isGettingOverAllUsage: true
    };
    break;
    case 'OVERALL_USAGE_CALCULATED': return {
      ...state,
      isGettingOverAllUsage: false,
      overAllUsage: payload
    };
    break;
    case 'RESETTING_OVERALL_USAGE_CALCULATION': return {
      ...state,
      isGettingOverAllUsage: false,
      overAllUsage: 0,
      usageOverTime: 0
    }
    break;
    case 'USAGE_OVERTIME_CALCULATED': return {
      ...state,
      isCalculating: false, 
      usageOverTime: usage
    }
    break;
    default: return state;
  }
}

export default Stats;