import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, TextField, Paper, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useWishlist, useWishlistDispatch, useForm } from '.';
import { postReq } from '../utils';

import Blob from '../public/blob.png';
import Blob2 from '../public/blob2.png';

export default function Login() {
  const navigate = useNavigate();
  const { user } = useWishlist();
  const { setUser } = useWishlistDispatch();
  const {
    form,
    resetErrors,
    toggleLoading,
    serverError,
    changeUsernameField,
    changePasswordField,
  } = useForm();

  useEffect(() => {
    if (user.isAuthenticated) {
      navigate('/content');
    }
  }, [user.isAuthenticated]);

  const handleSubmit = async () => {
    resetErrors();
    toggleLoading();
    const res = await postReq('/login', {
      username: form.username,
      password: form.password1,
    });
    const json = await res.json();
    toggleLoading();
    if (res.status === 500 || json.errorType === 'User') {
      serverError(true, json.error);
    } else if (res.status === 400) {
      serverError(false, json.error);
    } else {
      setUser(json.jwt);
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
          onChange={(e) => changeUsernameField(e.target.value)}
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
          onChange={(e) => changePasswordField(true, e.target.value)}
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
