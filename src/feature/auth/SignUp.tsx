import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Grid, Box, Typography, Container } from '@mui/material'; // Material UI components

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // For displaying error message
  const [formErrors, setFormErrors] = useState<any>({}); // Store validation errors
  const navigate = useNavigate();

  // Email regex for validation
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // At least 8 characters, 1 uppercase, 1 number, 1 special char

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email, username, and password
    const errors: any = {};

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

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return; // Stop the form submission if there are validation errors
    }

    try {
      const response = await axios.post('http://localhost:8080/auth/signup', {
        email,
        username,
        password,
      });

      // If sign-up is successful, redirect to login page
      alert('User registered successfully!');
      navigate('/login');
    } catch (error: any) {
      // Check if the error is from the backend response
      if (error.response && error.response.data) {
        const backendMessage = error.response.data.message;
        const backendDetails = error.response.data.details;
        setError(`${backendMessage}: ${backendDetails}`);
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: { xs: 4, sm: 6, md: 8 } }}>
        <Typography variant="h5" sx={{ mb: 3 }}>Sign Up</Typography>
        <form onSubmit={handleSignUp} style={{ width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                error={!!formErrors.email} // Show error if there's an error
                helperText={formErrors.email} // Display error message
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                error={!!formErrors.username}
                helperText={formErrors.username}
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
                error={!!formErrors.password}
                helperText={formErrors.password}
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
                Sign Up
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};

export default SignUp;
