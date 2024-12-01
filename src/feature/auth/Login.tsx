import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Grid,
  Typography,
  Container,
  Box,
} from "@mui/material";
import "./Login.css";

/**
 * Login Component
 * Handles user login functionality with form validation.
 */
const Login: React.FC = () => {
  // State variables for form inputs, validation errors, and backend errors
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  // Regex for password validation:
  // At least 8 characters, one uppercase, one number, and one special character
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  /**
   * Handles form submission for login.
   * Validates form inputs and makes a POST request to the login endpoint.
   * @param {React.FormEvent} e - Form submission event
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    // Input validation
    if (!username) errors.username = "Username is required";
    if (!password) {
      errors.password = "Password is required";
    } else if (!passwordRegex.test(password)) {
      errors.password =
        "Password must be at least 8 characters, contain one uppercase letter, one number, and one special character";
    }

    // If validation errors exist, set them and stop submission
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      // Make a POST request to the login endpoint
      const response = await axios.post("http://localhost:8080/auth/login", {
        username,
        password,
      });
      const { token, role } = response.data;

      // Store token and role in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // Navigate to the appropriate dashboard based on role
      navigate(role === "ADMIN" ? "/admin/dashboard" : "/user/dashboard");
    } catch (error: any) {
      // Set backend error message if provided, otherwise show a generic error
      setError(
        error.response?.data?.message ||
          "An unexpected error occurred. Please try again."
      );
    }
  };

  /**
   * Redirects user to the sign-up page.
   */
  const handleSignUpRedirect = () => navigate("/signup");

  return (
    <Container maxWidth="xs" className="login-container">
      <Box className="login-box">
        {/* Application Title */}
        <Typography variant="h4" className="login-title">
          Book Inventory Management System
        </Typography>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="login-form">
          <Grid container spacing={3}>
            {/* Username Input Field */}
            <Grid item xs={12}>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={!!formErrors.username}
                helperText={formErrors.username}
              />
            </Grid>

            {/* Password Input Field */}
            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!formErrors.password}
                helperText={formErrors.password}
              />
            </Grid>

            {/* Display error message if login fails */}
            {error && (
              <Grid item xs={12}>
                <Typography
                  color="error"
                  variant="body2"
                  className="login-error"
                >
                  {error}
                </Typography>
              </Grid>
            )}

            {/* Login Button */}
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                type="submit"
                className="login-button"
              >
                Login
              </Button>
            </Grid>

            {/* Sign-Up Redirect Button */}
            <Grid item xs={12}>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={handleSignUpRedirect}
                className="signup-button"
              >
                Don't have an account? Sign Up
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
