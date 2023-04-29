import { useContext } from 'react';
import { WishlistContext, useAuthForm } from '..';

function useForm() {
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
}

export default function useWishlist() {
  const state = useContext(WishlistContext);
  return { user: state.user, add: state.add, page: state.page, useForm };
}
