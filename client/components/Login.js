import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, TextField, Paper, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useUserData, useUserDispatch, resetErrors, useFormData } from '.';
import { postReq } from '../utils';

import Blob from '../public/blob.png';
import Blob2 from '../public/blob2.png';

export default function Login() {
  const [form, dispatch] = useFormData();
  const navigate = useNavigate();

  const user = useUserData();
  const { loginUser } = useUserDispatch();

  useEffect(() => {
    if (user.isAuthenticated) {
      navigate('/content');
    }
  }, [user.isAuthenticated]);

  const handleSubmit = async () => {
    resetErrors(dispatch);
    dispatch({ type: 'loading' });
    const res = await postReq('/login', {
      username: form.username,
      password: form.password1,
    });
    const json = await res.json();
    dispatch({ type: 'loading' });
    switch (String(res.status)) {
      case '500': {
        dispatch({ type: 'error', serverError: true, error: json.error });
        return;
      }
      case '400': {
        if (json.errorType === 'User') {
          // server errors go on "username" box
          dispatch({ type: 'error', serverError: true, error: json.error });
          return;
        }
        dispatch({ type: 'error', serverError: false, error: json.error });
        return;
      }
      case '200': {
        loginUser(json.jwt);
        return;
      }
      default: {
        alert('Unexpected server response. Please try again.');
      }
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
      }}
    >
      <Paper variant='outlined'>
        <img
          src={Blob2}
          alt='blob'
          style={{
            position: 'absolute',
            left: 0,
            bottom: '14vw',
            width: '25vw',
          }}
        />
      </Paper>
      <Paper variant='outlined'>
        <img
          src={Blob}
          alt='blob'
          style={{ position: 'absolute', right: 0, top: '16vw', width: '25vw' }}
        />
      </Paper>
      <Box
        sx={{
          width: '400px',
          height: '400px ',
          backgroundColor: '#a1caf1',
          display: 'grid',
          gridTemplateColumns: 'repeat(1, 60%)',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '20px',
          boxShadow: '10px 5px 5px #92a1cf',
          paddingTop: '20px',
          paddingBottom: '10px',
        }}
      >
        <TextField
          required
          error={!!form.serverError}
          helperText={form.serverError}
          label='Username'
          name='username'
          placeholder='Enter your username'
          value={form.username}
          onChange={(e) => {
            dispatch({ type: 'username', username: e.target.value });
          }}
        />
        <TextField
          required
          error={!!form.passwordError}
          helperText={form.passwordError}
          label='Password'
          type='password'
          name='password'
          placeholder='Enter your password'
          value={form.password1}
          onChange={(e) => {
            dispatch({
              type: 'password',
              password1: true,
              password: e.target.value,
            });
          }}
        />
        <LoadingButton
          onClick={handleSubmit}
          variant='contained'
          loading={form.loading}
        >
          Submit
        </LoadingButton>

        <Typography
          variant='subtitle1'
          color='text.secondary'
          style={{ fontFamily: 'Raleway', fontWeight: 300 }}
        >
          Don't Have an Account? <Link to='/register'>Register</Link>
        </Typography>
      </Box>
    </Box>
  );
}
