import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import './app.css';

// Define the router with routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" /> // Redirect to login page by default
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <SignUp />
  },
  {
    path: '/admindashboard',
    element: <AdminDashboard />
  },
  {
    path: '/userdashboard',
    element: <UserDashboard />
  },
  {
    path: '*',
    element: <h1>404 - Page Not Found</h1>
  }
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;