import { betConstants } from '../_constants';

export function bets(state = {}, action) {
  switch (action.type) {
    case betConstants.GETALL_REQUEST:
      return {
        loading: true
      };
    case betConstants.GETALL_SUCCESS:
      return {
        items: action.bets
      };
    case betConstants.GETALL_FAILURE:
      return { 
        error: action.error
      };
    case betConstants.DELETE_REQUEST:
      // add 'deleting:true' property to user being deleted
      return {
        ...state,
        items: state.items.map(bet =>
          bet.id === action.id
            ? { ...bet, deleting: true }
            : bet
        )
      };
    case betConstants.DELETE_SUCCESS:
      // remove deleted user from state
      return {
        items: state.items.filter(bet => bet.id !== action.id)
      };
    case betConstants.DELETE_FAILURE:
      // remove 'deleting:true' property and add 'deleteError:[error]' property to user 
      return {
        ...state,
        items: state.items.map(bet => {
          if (bet.id === action.id) {
            // make copy of user without 'deleting:true' property
            const { deleting, ...betCopy } = bet;
            // return copy of user with 'deleteError:[error]' property
            return { ...betCopy, deleteError: action.error };
          }

          return bet;
        })
      };
    default:
      return state
  }
}