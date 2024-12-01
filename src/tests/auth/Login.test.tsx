import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../../feature/auth/Login'; 
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { BrowserRouter as Router } from 'react-router-dom';

// Create an instance of axios mock adapter
const mock = new MockAdapter(axios);

describe('Login Component', () => {
  beforeEach(() => {
    mock.reset();
  });

  test('renders login form', () => {
    render(
      <Router>
        <Login />
      </Router>
    );
    
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/don't have an account\? sign up/i)).toBeInTheDocument();
  });

  test('shows validation error for empty fields', async () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.click(screen.getByText(/login/i));

    // Use findByText for async validation error messages
    await waitFor(() => {
      expect(screen.getByText(/username is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  test('shows password regex error', async () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'short' } });
    fireEvent.click(screen.getByText(/login/i));

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });

  test('successful login', async () => {
    mock.onPost('http://localhost:8080/auth/login').reply(200, {
      token: 'mocked-token',
      role: 'USER',
    });

    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password1!' } });
    fireEvent.click(screen.getByText(/login/i));

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('mocked-token');
      expect(localStorage.getItem('role')).toBe('USER');
      // Verify if navigation happened (in this case, just assert the URL)
      expect(window.location.pathname).toBe('/user/dashboard');
    });
  });

  test('failed login due to backend error', async () => {
    mock.onPost('http://localhost:8080/auth/login').reply(400, {
      message: 'Invalid credentials',
      details: 'Please check your username or password.',
    });

    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'wronguser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByText(/login/i));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials: please check your username or password/i)).toBeInTheDocument();
    });
  });
});
