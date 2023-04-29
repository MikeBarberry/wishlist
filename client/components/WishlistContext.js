import { createContext, useContext, useReducer } from 'react';
import jwtDecode from 'jwt-decode';
import { postReq } from '../utils';
import { useAuthForm } from '.';

const WishlistContext = createContext(null);
const WishlistDispatchContext = createContext(null);

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

export function useWishlist() {
  const state = useContext(WishlistContext);

  const useForm = () => {
    const [state, dispatch] = useAuthForm();

    const resetErrors = () => {
      dispatch({ type: 'reset_errors' });
    };
    const toggleLoading = () => {
      dispatch({ type: 'loading' });
    };
    const serverError = (server, error) => {
      dispatch({ type: 'error', serverError: server, error });
    };
    const passwordMatchError = () => {
      dispatch({
        type: 'error',
        serverError: false,
        error: `Passwords don't match`,
      });
    };
    const changeUsernameField = (value) => {
      dispatch({ type: 'username', username: value });
    };
    const changePasswordField = (field1, value) => {
      dispatch({
        type: 'password',
        password1: field1,
        password: value,
      });
    };
    return {
      form: state,
      resetErrors,
      toggleLoading,
      serverError,
      passwordMatchError,
      changePasswordField,
      changeUsernameField,
    };
  };

  return { user: state.user, add: state.add, page: state.page, useForm };
}

export function useWishlistDispatch() {
  const dispatch = useContext(WishlistDispatchContext);

  const setUser = (token) => {
    localStorage.setItem('jwt', token);
    const decoded = jwtDecode(token);
    dispatch({
      type: 'set_user',
      user: decoded.username,
    });
  };

  const logoutUser = () => {
    localStorage.clear();
    dispatch({
      type: 'set_user',
      user: '',
    });
  };

  const getUserContent = async (token) => {
    togglePageLoading(true);
    try {
      const response = await postReq('/getcontent', { jwt: token });
      const json = await response.json();
      const { content } = json;
      dispatch({
        type: 'set_content',
        content: content,
      });
    } catch (err) {
      updatePageMessage('A server error occurred', 'error');
      console.error(`Get content error: ${err}`);
    }
    togglePageLoading(false);
  };

  const addContent = async (body) => {
    toggleAddFormLoading(true);
    try {
      const response = await postReq('/addcontent', body);
      const json = await response.json();
      const { updatedContent } = json;
      dispatch({
        type: 'set_content',
        content: updatedContent,
      });
      resetAddForm();
      updatePageMessage('Card Added!');
    } catch (err) {
      updatePageMessage('A server error occurred', 'error');
      console.error(`Add content error: ${err}`);
    }
    toggleAddFormLoading(false);
  };

  const deleteContent = async (body) => {
    const response = await postReq('/deletecontent', body);
    const json = await response.json();
    const { updatedContent } = json;
    dispatch({
      type: 'set_content',
      content: updatedContent,
    });
  };

  const validateAddedContent = (a, b, c) => {
    if (!a || !b || !c) {
      updatePageMessage('A field is missing.', 'error');
      return false;
    }
    return true;
  };

  const updateAddForm = (target) => {
    dispatch({
      type: 'update_add_form',
      target: target.name,
      value: target.value,
    });
  };

  const togglePageLoading = (loading) => {
    dispatch({ type: 'toggle_loading', location: 'page', loading });
  };

  const toggleAddFormLoading = (loading) => {
    dispatch({ type: 'toggle_loading', location: 'add', loading });
  };

  const resetAddForm = () => {
    dispatch({ type: 'reset_add_form' });
  };

  const updatePageMessage = (text, severity) => {
    dispatch({
      type: 'update_page_message',
      text,
      severity: severity || 'success',
    });
  };

  const increaseCardCount = () => {
    dispatch({ type: 'increase_card_count' });
  };

  const updateSearchQuery = (query) => {
    dispatch({ type: 'update_search_query', query });
  };

  return {
    setUser,
    logoutUser,
    getUserContent,
    addContent,
    deleteContent,
    updateAddForm,
    validateAddedContent,
    resetAddForm,
    updatePageMessage,
    increaseCardCount,
    updateSearchQuery,
  };
}
