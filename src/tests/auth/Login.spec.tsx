import React from 'react'; // Add this at the top of your file
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from '../../feature/auth/Login';
import axios from 'axios';


// Mocking the useNavigate hook
const mockNavigate = jest.fn();

// Mocking axios post request
jest.mock('axios');

// TypeScript knows about the axios post method because we're using the correct types
axios.post = jest.fn();

// Mocking the useNavigate hook from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear any mock calls before each test
  });

  test('renders login form', () => {
    render(
      <Router>
        <Login />
      </Router>
    );
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('displays validation errors when fields are empty or invalid', async () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Check if validation error messages are shown
    await waitFor(() => {
      expect(screen.getByText(/username is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  test('displays error when login fails', async () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    // Mocking an API failure
    (axios.post as jest.Mock).mockRejectedValueOnce({
      response: {
        data: {
          message: 'Invalid credentials',
          details: 'The username or password is incorrect.',
        },
      },
    });

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials: the username or password is incorrect/i)).toBeInTheDocument();
    });
  });

  test('navigates to correct dashboard on successful login (ADMIN)', async () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    // Mocking a successful login response with role 'ADMIN'
    (axios.post as jest.Mock).mockResolvedValueOnce({
      data: { token: 'fakeToken', role: 'ADMIN' },
    });

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password123!' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard');
    });
  });

  test('navigates to correct dashboard on successful login (USER)', async () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    // Mocking a successful login response with role 'USER'
    (axios.post as jest.Mock).mockResolvedValueOnce({
      data: { token: 'fakeToken', role: 'USER' },
    });

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password123!' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/user/dashboard');
    });
  });
});
