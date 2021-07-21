// Redux for moving attributes around with state
import { GET_DECLARATION, SET_DECLARATION, SET_ITEM_STATE } from "../types";
import { initialState } from './DeclarationState'

// Boiler plate - template for REDUCER function
export default (state, action) => {
  switch (action.type) {
    case GET_DECLARATION:
      return state;
    case SET_DECLARATION:
      const { page, section, current } = action.payload;
      if (!page && !section) {
        if (typeof current === 'object' && !Array.isArray(current)) {
          return {
            ...initialState,
            ...action.payload.current
          }
        }
      } else if (!action.payload.section) {
        return {
          ...state,
          [action.payload.page]: {
            ...state[action.payload.page],
            ...action.payload.current,
          },
        };
      } else {
        return {
          ...state,
          [page]: {
            ...state[page],
            [section]: Array.isArray(state[page][section]) ?
              [
                ...current
              ]
              : {
                ...state[section],
                ...current
              }
          }
        }
      }
      break;

    case SET_ITEM_STATE:
      const { itemIndex, data } = action.payload;
      let declarationItems = state.declaration.declarationItems;
      declarationItems[itemIndex] = {
        ...declarationItems[itemIndex],
        [action.payload.section]: data
      }

      return {
        ...state,
        declaration: {
          ...state.declaration,
          declarationItems
        }
      }

    default:
      return state;
  }
};
