import React from 'react'; // Add this at the top of your file
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignUp from '../../feature/auth/SignUp'; // Adjust path if necessary
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';


// Mocking axios.post request
jest.mock('axios');

// Define the mock type for axios
const mockAxios = axios as jest.Mocked<typeof axios>;

// Mocking the useNavigate hook
const mockNavigate = jest.fn();

// Mocking the useNavigate hook from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('SignUp Component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear any mock calls before each test
  });

  test('renders sign up form', () => {
    render(
      <Router>
        <SignUp />
      </Router>
    );
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  test('displays validation errors when fields are empty or invalid', async () => {
    render(
      <Router>
        <SignUp />
      </Router>
    );

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    // Check if validation error messages are shown
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/username is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  test('displays error when sign-up fails', async () => {
    render(
      <Router>
        <SignUp />
      </Router>
    );

    // Mocking an API failure
    mockAxios.post.mockRejectedValueOnce({
      response: {
        data: {
          message: 'User already exists',
          details: 'This email or username is already taken.',
        },
      },
    });

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password123!' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/user already exists: this email or username is already taken/i)).toBeInTheDocument();
    });
  });

  test('navigates to login on successful sign up', async () => {
    render(
      <Router>
        <SignUp />
      </Router>
    );

    // Mocking a successful sign-up response
    mockAxios.post.mockResolvedValueOnce({
      data: { message: 'User registered successfully!' },
    });

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password123!' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });
});
