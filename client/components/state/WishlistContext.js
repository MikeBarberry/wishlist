import { createContext, useReducer } from 'react';

let initialState = {
  user: {
    username: '',
    isAuthenticated: false,
    content: [],
    token: null,
    nextID: 0,
  },
  add: {
    title: '',
    description: '',
    image: '',
    loading: false,
  },
  page: {
    search: '',
    numCards: 8,
    message: {
      visible: false,
      text: '',
      severity: 'success',
    },
    loading: false,
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'set_user': {
      return {
        ...state,
        user: {
          ...state.user,
          isAuthenticated: !!action.user,
          username: action.user,
        },
      };
    }
    case 'set_content': {
      return {
        ...state,
        user: {
          ...state.user,
          content: action.content,
        },
      };
    }
    case 'update_add_form': {
      return {
        ...state,
        add: {
          ...state.add,
          [action.target]: action.value,
        },
      };
    }
    case 'reset_add_form': {
      return {
        ...state,
        add: initialState.add,
      };
    }
    case 'toggle_loading': {
      return {
        ...state,
        [action.location]: {
          ...state[action.location],
          loading: action.loading,
        },
      };
    }
    case 'increase_card_count': {
      return {
        ...state,
        page: {
          ...state.page,
          numCards: state.page.numCards + 4,
        },
      };
    }
    case 'update_page_message': {
      return {
        ...state,
        page: {
          ...state.page,
          message: {
            visible: !!action.text,
            text: action.text,
            severity: action.severity,
          },
        },
      };
    }
    case 'update_search_query': {
      return {
        ...state,
        page: {
          ...state.page,
          search: action.query,
        },
      };
    }
    default:
      throw Error('Unknown action: ' + action.type);
  }
};

export const WishlistContext = createContext(null);
export const WishlistDispatchContext = createContext(null);

export function WishlistContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <WishlistContext.Provider value={state}>
      <WishlistDispatchContext.Provider value={dispatch}>
        {children}
      </WishlistDispatchContext.Provider>
    </WishlistContext.Provider>
  );
}
