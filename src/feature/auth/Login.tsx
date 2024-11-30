import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Grid, Box, Typography, Container } from '@mui/material'; // Material UI components

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // For displaying backend error message
  const [formErrors, setFormErrors] = useState<any>({}); // Store validation errors
  const navigate = useNavigate(); // To navigate to the dashboard after login

  // Password regex for validation (similar to sign-up page)
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // At least 8 characters, 1 uppercase, 1 number, 1 special char

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate username and password
    const errors: any = {};

    // Username validation
    if (!username) {
      errors.username = 'Username is required';
    }

    // Password validation
    if (!password) {
      errors.password = 'Password is required';
    } else if (!passwordRegex.test(password)) {
      errors.password =
        'Password must be at least 8 characters, contain one uppercase letter, one number, and one special character';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return; // Stop the form submission if there are validation errors
    }

    try {
      const response = await axios.post('http://localhost:8080/auth/login', { username, password });

      const { token, role } = response.data;

      // Store token and role in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      // Redirect based on role
      if (role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (error: any) {
      // Handle backend error responses
      if (error.response && error.response.data) {
        const backendMessage = error.response.data.message;
        const backendDetails = error.response.data.details;
        setError(`${backendMessage}: ${backendDetails}`);
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    }
  };

  const handleSignUpRedirect = () => {
    // Redirect to SignUp page
    navigate('/signup');
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: { xs: 4, sm: 6, md: 8 } }}>
        <Typography variant="h5" sx={{ mb: 3 }}>Login</Typography>
        <form onSubmit={handleLogin} style={{ width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                error={!!formErrors.username} // Show error if there's an error
                helperText={formErrors.username} // Display error message
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                error={!!formErrors.password} // Show error if there's an error
                helperText={formErrors.password} // Display error message
              />
            </Grid>
            {error && (
              <Grid item xs={12}>
                <Typography color="error" variant="body2" align="center">
                  {error} {/* Display the error message */}
                </Typography>
              </Grid>
            )}
            <Grid item xs={12}>
              <Button variant="contained" color="primary" fullWidth type="submit">
                Login
              </Button>
            </Grid>
            {/* SignUp Button below the Login button */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={handleSignUpRedirect}
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
