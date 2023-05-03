import { useNavigate, Link } from 'react-router-dom';
import { Box, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm } from '.';
import { postReq } from '../utils';

export default function Register() {
  const navigate = useNavigate();
  const {
    form,
    resetErrors,
    toggleLoading,
    serverError,
    passwordMatchError,
    changeUsernameField,
    changePasswordField,
  } = useForm();

  const handleSubmit = async () => {
    resetErrors();
    if (form.password1 !== form.password2) {
      passwordMatchError();
      return;
    }
    toggleLoading();
    const res = await postReq('/register', {
      username: form.username,
      password: form.password1,
    });
    const json = await res.json();
    toggleLoading();
    if (res.status === 200) {
      navigate('/');
    }
    serverError(true, json.error);
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
      <Box
        sx={{
          zIndex: 'auto',
          height: '50vw',
          width: '90vw',
          backgroundColor: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundImage:
            "linear-gradient(270deg, rgba(176, 42, 42, 0.16) 0%,rgba(176, 42, 42, 0.56) 18.45%,rgba(176, 42, 42, 0.8) 49.67%,rgba(176, 42, 42, 0.56) 82.52%,rgba(176, 42, 42, 0.196364) 99.7%,rgba(189, 40, 40, 0) 99.71%,rgba(203, 56, 55, 0) 99.72%,rgba(203, 56, 55, 0.16) 99.73%),url('https://static.npmjs.com/attachments/ck3uwdslwmr4gc9740vqxa800-bg-teams.png')",
        }}
      >
        <Box
          sx={{
            zIndex: 1,
            height: '80%',
            width: '40%',
            backgroundColor: 'white',
            border: 'solid',
            borderRadius: '4rem',
            borderColor: '#a1caf1',
            borderWidth: '1em',
            display: 'grid',
            gridTemplateColumns: 'repeat(1, 60%)',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '20px',
            paddingTop: '4vw',
            paddingBottom: '7vw',
          }}
        >
          <TextField
            sx={{
              zIndex: 2,
            }}
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
            sx={{
              zIndex: 2,
            }}
            required
            type='password'
            label='Password'
            name='password'
            placeholder='Enter your password'
            value={form.password1}
            onChange={(e) => changePasswordField(true, e.target.value)}
          />
          <TextField
            sx={{
              zIndex: 2,
            }}
            required
            error={!!form.passwordError}
            helperText={form.passwordError}
            type='password'
            label='Repeat Password'
            name='password2'
            placeholder='Enter your password again'
            value={form.password2}
            onChange={(e) => changePasswordField(false, e.target.value)}
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
            style={{
              paddingLeft: '2vw',
              fontFamily: 'Raleway',
              fontWeight: 300,
              zIndex: 2,
            }}
          >
            Already Have an Account? <Link to='/'>Login</Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
