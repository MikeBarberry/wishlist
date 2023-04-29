import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Login, Register, Page, useUserData, useUserDispatch } from '.';

export default function App() {
  const user = useUserData();
  const { loginUser, getUserContent } = useUserDispatch();

  useEffect(() => {
    if (localStorage.jwt) {
      const jwt = localStorage.jwt;
      loginUser(jwt);
    }

    if (user.isAuthenticated) {
      const jwt = localStorage.jwt;
      getUserContent(jwt);
    }
  }, [user.isAuthenticated]);

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

  return <RouterProvider router={router} />;
}
