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

export default function useForm() {
  const [state, dispatch] = useReducer(reducer, initialState);

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
}
