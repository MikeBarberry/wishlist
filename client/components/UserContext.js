import { createContext, useContext, useReducer } from 'react';
import jwtDecode from 'jwt-decode';
const UserContext = createContext(null);
const UserDispatchContext = createContext(null);

import { postReq } from '../utils';

let initialState = {
  username: '',
  isAuthenticated: false,
  content: [],
  message: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'set_user':
      return {
        ...state,
        isAuthenticated: !!action.user,
        username: action.user,
      };
    case 'set_content':
      return {
        ...state,
        content: action.content,
      };
    case 'message': {
      return {
        ...state,
        message: !state.message,
      };
    }
    default:
      throw Error('Unknown action: ' + action.type);
  }
};

export function UserContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
}

export function useUserData() {
  return useContext(UserContext);
}

export function useUserDispatch() {
  const dispatch = useContext(UserDispatchContext);

  const loginUser = (token) => {
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
    const response = await postReq('/getcontent', { jwt: token });
    const json = await response.json();
    const { content } = json;
    dispatch({
      type: 'set_content',
      content: content,
    });
  };

  const addContent = async (body) => {
    const response = await postReq('/addcontent', body);
    const json = await response.json();
    const { updatedContent } = json;
    dispatch({
      type: 'set_content',
      content: updatedContent,
    });
    dispatch({ type: 'message' });
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
  return { loginUser, logoutUser, getUserContent, addContent, deleteContent };
}
