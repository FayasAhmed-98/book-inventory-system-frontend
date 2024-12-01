
import { render, screen, waitFor } from '@testing-library/react';
import { BooksProvider } from '../../context/BooksContext';
import AdminDashboard from '../../feature/book-management/Admindashboard';
import userEvent from '@testing-library/user-event';

// Mock the BooksContext
const mockAddBook = jest.fn();
const mockUpdateBook = jest.fn();
const mockDeleteBook = jest.fn();
const mockBooks = [
  { id: 1, title: "Book 1", author: "Author 1", genre: "Fiction", price: 10 },
  { id: 2, title: "Book 2", author: "Author 2", genre: "Non-Fiction", price: 15 },
];

// Helper function to render the AdminDashboard with context
const renderAdminDashboard = () => {
  return render(
    <BooksProvider value={{
      books: mockBooks,
      addBook: mockAddBook,
      updateBook: mockUpdateBook,
      deleteBook: mockDeleteBook,
      error: null,
      setError: jest.fn()
    }}>
      <AdminDashboard />
    </BooksProvider>
  );
};

describe('AdminDashboard', () => {
  test('renders books table', () => {
    renderAdminDashboard();
    expect(screen.getByText('Book 1')).toBeInTheDocument();
    expect(screen.getByText('Book 2')).toBeInTheDocument();
  });

  test('adds a new book', async () => {
    renderAdminDashboard();
    
    // Simulate user typing in the form fields
    userEvent.type(screen.getByLabelText(/title/i), 'Book 3');
    userEvent.type(screen.getByLabelText(/author/i), 'Author 3');
    userEvent.type(screen.getByLabelText(/genre/i), 'Sci-Fi');
    userEvent.type(screen.getByLabelText(/price/i), '20');
    
    // Simulate submitting the form
    userEvent.click(screen.getByText('Add Book'));
    
    // Ensure addBook is called with the correct values
    await waitFor(() => expect(mockAddBook).toHaveBeenCalledWith({
      title: 'Book 3',
      author: 'Author 3',
      genre: 'Sci-Fi',
      price: 20,
    }));
  });

  test('updates a book', async () => {
    renderAdminDashboard();
    
    // Simulate user clicking the "Edit" button for Book 1
    userEvent.click(screen.getByText('Edit'));

    // Update the details in the form
    userEvent.clear(screen.getByLabelText(/title/i));
    userEvent.type(screen.getByLabelText(/title/i), 'Updated Book 1');

    // Simulate form submission
    userEvent.click(screen.getByText('Update Book'));

    // Ensure updateBook was called with the correct parameters
    await waitFor(() => expect(mockUpdateBook).toHaveBeenCalledWith({
      id: 1,
      title: 'Updated Book 1',
      author: 'Author 1',
      genre: 'Fiction',
      price: 10,
    }));
  });

  test('deletes a book', async () => {
    renderAdminDashboard();

    // Simulate user clicking the "Delete" button for Book 1
    userEvent.click(screen.getByText('Delete'));

    // Ensure deleteBook was called with the correct book ID
    await waitFor(() => expect(mockDeleteBook).toHaveBeenCalledWith(1));

    // Ensure that the deleted book is no longer in the document
    expect(screen.queryByText('Book 1')).not.toBeInTheDocument();
  });

  test('filters books by search term', async () => {
    renderAdminDashboard();
    const searchInput = screen.getByLabelText('Search Books');
    
    userEvent.type(searchInput, 'Book 1');
    expect(screen.getByText('Book 1')).toBeInTheDocument();
    expect(screen.queryByText('Book 2')).not.toBeInTheDocument();
  });
});
