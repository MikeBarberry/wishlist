import { WishlistContextProvider, Login, Register, Page } from '.';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const theme = createTheme({
  typography: {
    fontFamily: 'Raleway',
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/content',
    element: <Page />,
  },
]);

export default function Container() {
  return (
    <WishlistContextProvider>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />;
      </ThemeProvider>
    </WishlistContextProvider>
  );
}
