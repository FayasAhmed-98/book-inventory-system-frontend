import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './feature/auth/Login';
import SignUp from './feature/auth/SignUp';
// import AdminDashboard from './features/admin/AdminDashboard';  // Import your AdminDashboard component
// import UserDashboard from './features/user/UserDashboard';    // Import your UserDashboard component
import PrivateRoute from './components/PrivateRoute';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          {/* <Route 
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
          /> */}

          {/* If no route matches, redirect to login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
