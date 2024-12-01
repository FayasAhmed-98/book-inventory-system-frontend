import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { BooksProvider } from "./context/BooksContext";
import PrivateRoute from "./components/PrivateRoute";

// Lazy load components
const Login = lazy(() => import("./feature/auth/Login"));
const SignUp = lazy(() => import("./feature/auth/SignUp"));
const AdminDashboard = lazy(
  () => import("./feature/book-management/Admindashboard")
);
const UserDashboard = lazy(
  () => import("./feature/book-management/UserDashboard")
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BooksProvider>
        <Router>
          <Suspense fallback={<div>Loading...</div>}>
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
              {/* Default Route */}
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </Suspense>
        </Router>
      </BooksProvider>
    </AuthProvider>
  );
};

export default React.memo(App);
