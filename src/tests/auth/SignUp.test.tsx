import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom'; // To wrap the component with Router for navigation
import axios from 'axios';
import SignUp from '../../feature/auth/SignUp'; 

// Mock axios
jest.mock('axios');

describe('SignUp Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the sign-up form correctly', () => {
    render(
      <Router>
        <SignUp />
      </Router>
    );

    // Check if form fields and button are rendered
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  test('shows validation errors when fields are empty', async () => {
    render(
      <Router>
        <SignUp />
      </Router>
    );

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      // Check for validation errors
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/username is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  test('shows invalid email error message', async () => {
    render(
      <Router>
        <SignUp />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'invalidemail' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  test('shows password strength validation error', async () => {
    render(
      <Router>
        <SignUp />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'weakpass' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });

  test('submits form successfully and redirects on successful signup', async () => {
    // Mock a successful response from axios
    axios.post.mockResolvedValueOnce({
      data: { message: 'User registered successfully!' },
    });

    render(
      <Router>
        <SignUp />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'ValidP@ss123' } });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    // Wait for successful submission
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/auth/signup', {
        email: 'test@example.com',
        username: 'testuser',
        password: 'ValidP@ss123',
      });

      // Check for successful redirect (this is assuming you're using react-router)
      expect(window.location.pathname).toBe('/login');
    });
  });

  test('handles error during signup and displays error message', async () => {
    // Mock an error response from axios
    axios.post.mockRejectedValueOnce({
      response: { data: { message: 'User already exists', details: 'This email is taken.' } },
    });

    render(
      <Router>
        <SignUp />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'ValidP@ss123' } });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/user already exists: this email is taken/i)).toBeInTheDocument();
    });
  });
});
