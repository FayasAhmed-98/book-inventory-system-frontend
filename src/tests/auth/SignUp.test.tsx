import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import SignUp from "../../feature/auth/SignUp";

jest.mock("axios"); // Mock axios

describe("SignUp Component", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  test("submits form successfully and redirects on successful signup", async () => {
    // Mock successful API response
    (axios.post as jest.Mock).mockResolvedValueOnce({
      data: { message: "User registered successfully!" },
    });

    render(
      <Router>
        <SignUp />
      </Router>
    );

    // Fill in form fields
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "ValidP@ss123" },
    });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    // Assert API call and redirection
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:8080/auth/signup",
        {
          email: "test@example.com",
          username: "testuser",
          password: "ValidP@ss123",
        }
      );
      expect(window.location.pathname).toBe("/login");
    });
  });

  test("handles error during signup and displays error message", async () => {
    // Mock error response
    (axios.post as jest.Mock).mockRejectedValueOnce({
      response: {
        data: {
          message: "User already exists",
          details: "This email is taken.",
        },
      },
    });

    render(
      <Router>
        <SignUp />
      </Router>
    );

    // Fill in form fields
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "ValidP@ss123" },
    });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    // Assert error message
    await waitFor(() => {
      expect(
        screen.getByText(/user already exists: this email is taken/i)
      ).toBeInTheDocument();
    });
  });
});
