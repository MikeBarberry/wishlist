import { UserContextProvider } from './UserContext';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import App from './App';

const theme = createTheme({
  typography: {
    fontFamily: 'Raleway',
  },
});

export default function Container() {
  return (
    <UserContextProvider>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </UserContextProvider>
  );
}
