import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BooksProvider } from './context/BooksContext'; // Import BooksProvider
import Login from './feature/auth/Login';
import SignUp from './feature/auth/SignUp';
import AdminDashboard from './feature/book-management/Admindashboard'; 
import UserDashboard from './feature/book-management/UserDashboard';   
import PrivateRoute from './components/PrivateRoute';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BooksProvider> {/* Wrap the components that need BooksContext */}
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <PrivateRoute role="ADMIN" redirectTo="/login">
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route 
              path="/user/dashboard" 
              element={
                <PrivateRoute role="USER" redirectTo="/login">
                  <UserDashboard />
                </PrivateRoute>
              } 
            /> 
            {/* If no route matches, redirect to login */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </BooksProvider>
    </AuthProvider>
  );
};

export default App;
