import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Grid, Typography, Container, Box } from '@mui/material';
import './SignUp.css'; 

/**
 * SignUp Component
 * Handles user registration functionality with form validation.
 */
const SignUp: React.FC = () => {
  // State variables for form inputs, validation errors, and backend errors
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  // Regular expressions for validation
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  /**
   * Handles form submission for sign-up.
   * Validates form inputs and makes a POST request to the sign-up endpoint.
   * @param {React.FormEvent} e - Form submission event
   */
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    // Email validation
    if (!email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Username validation
    if (!username) {
      errors.username = 'Username is required';
    } else if (username.length < 3 || username.length > 20) {
      errors.username = 'Username should be between 3 to 20 characters';
    }

    // Password validation
    if (!password) {
      errors.password = 'Password is required';
    } else if (!passwordRegex.test(password)) {
      errors.password =
        'Password must be at least 8 characters, contain one uppercase letter, one number, and one special character';
    }

    // If validation errors exist, set them and stop submission
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      // Make a POST request to the sign-up endpoint
      const response = await axios.post('http://localhost:8080/auth/signup', { email, username, password });
      console.log(response.data);
      alert('User registered successfully!');
      navigate('/login'); // Redirect to login page on successful registration
    } catch (error: any) {
      // Set backend error message if provided, otherwise show a generic error
      setError(error.response?.data?.message || 'An unexpected error occurred. Please try again.');
    }
  };

  return (
    <Container maxWidth="xs" className="signup-container">
      <Box className="signup-box">
        {/* Application Title */}
        <Typography variant="h4" className="signup-title">
          Book Inventory Management System
        </Typography>

        {/* Sign-Up Form */}
        <form onSubmit={handleSignUp} className="signup-form">
          <Grid container spacing={3}>
            {/* Email Input Field */}
            <Grid item xs={12}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!formErrors.email}
                helperText={formErrors.email}
              />
            </Grid>

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

            {/* Display error message if registration fails */}
            {error && (
              <Grid item xs={12}>
                <Typography color="error" variant="body2" className="signup-error">
                  {error}
                </Typography>
              </Grid>
            )}

            {/* Sign-Up Button */}
            <Grid item xs={12}>
              <Button variant="contained" color="primary" fullWidth type="submit" className="signup-button">
                Sign Up
              </Button>
            </Grid>
          </Grid>
        </form>

        {/* Redirect to Login */}
        <Grid item xs={12} className="login-redirect">
          <Typography variant="body2" align="center">
            Already have an account?{' '}
            <Button color="secondary" onClick={() => navigate('/login')}>
              Login
            </Button>
          </Typography>
        </Grid>
      </Box>
    </Container>
  );
};

export default SignUp;
