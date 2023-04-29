import { useReducer } from 'react';

const initialState = {
  username: '',
  password1: '',
  password2: '',
  serverError: '',
  passwordError: '',
  loading: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'username': {
      return {
        ...state,
        username: action.username,
      };
    }
    case 'password': {
      const password1 = action.password1;
      return {
        ...state,
        [password1 ? 'password1' : 'password2']: action.password,
      };
    }
    case 'error': {
      const serverError = action.serverError;
      return {
        ...state,
        [serverError ? 'serverError' : 'passwordError']: action.error,
      };
    }
    case 'loading': {
      return {
        ...state,
        loading: !state.loading,
      };
    }
    case 'reset_errors': {
      return {
        ...state,
        serverError: '',
        passwordError: '',
      };
    }
  }
};

export const resetErrors = (dispatch) => {
  dispatch({ type: 'reset_errors' });
};

export function useFormData() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return [state, dispatch];
}
