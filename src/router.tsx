import { createBrowserRouter } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import { ProtectedRoute } from './Components/ProtectedRoute';
import Layout from './Components/Layout';
//import UsersPage from './Pages/UsersPage';
import UsersPage from './Pages/UsersPageAI';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            path: '/',
            element: <UsersPage />,
          }
        ]
      }
    ],
  },
]);

export default router;