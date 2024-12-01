import { render, screen, waitFor } from '@testing-library/react';
import { BooksProvider } from '../../context/BooksContext'; // Make sure the path is correct
import AdminDashboard from '../../feature/book-management/Admindashboard'; // Make sure the path is correct
import userEvent from '@testing-library/user-event';


// Helper function to render AdminDashboard with context
const renderAdminDashboard = () => {
  return render(
    <BooksProvider>
      <AdminDashboard />
    </BooksProvider>
  );
};

describe('AdminDashboard', () => {
  test('renders books table', async () => {
    renderAdminDashboard();

    // Wait for books to load and check if they are rendered
    await waitFor(() => {
      expect(screen.getByText('Book 1')).toBeInTheDocument();
      expect(screen.getByText('Book 2')).toBeInTheDocument();
    });
  });

  test('adds a new book', async () => {
    renderAdminDashboard();

    // Open the modal for adding a new book
    const addButton = screen.getByText('Add Book');
    userEvent.click(addButton);

    // Fill out the form to add a new book
    const titleInput = screen.getByLabelText(/title/i);
    const authorInput = screen.getByLabelText(/author/i);
    const genreInput = screen.getByLabelText(/genre/i);
    const priceInput = screen.getByLabelText(/price/i);
    const stockInput = screen.getByLabelText(/stock/i);
    const descriptionInput = screen.getByLabelText(/description/i);

    userEvent.type(titleInput, 'New Book');
    userEvent.type(authorInput, 'New Author');
    userEvent.type(genreInput, 'Science Fiction');
    userEvent.type(priceInput, '20');
    userEvent.type(stockInput, '150');
    userEvent.type(descriptionInput, 'A new book description');

    // Submit the form to add the book
    const submitButton = screen.getByText('Submit');
    userEvent.click(submitButton);

    // Wait for the book to be added and check if it is displayed in the list
    await waitFor(() => {
      expect(screen.getByText('New Book')).toBeInTheDocument();
      expect(screen.getByText('New Author')).toBeInTheDocument();
    });
  });

  test('updates an existing book', async () => {
    renderAdminDashboard();

    // Open the modal to edit the first book
    const editButton = screen.getAllByText('Edit')[0];
    userEvent.click(editButton);

    // Change the details of the book
    const titleInput = screen.getByLabelText(/title/i);
    const authorInput = screen.getByLabelText(/author/i);
    const genreInput = screen.getByLabelText(/genre/i);
    const priceInput = screen.getByLabelText(/price/i);
    const stockInput = screen.getByLabelText(/stock/i);
    const descriptionInput = screen.getByLabelText(/description/i);

    userEvent.clear(titleInput);
    userEvent.type(titleInput, 'Updated Book Title');
    userEvent.clear(authorInput);
    userEvent.type(authorInput, 'Updated Author');
    userEvent.clear(genreInput);
    userEvent.type(genreInput, 'Updated Genre');
    userEvent.clear(priceInput);
    userEvent.type(priceInput, '25');
    userEvent.clear(stockInput);
    userEvent.type(stockInput, '200');
    userEvent.clear(descriptionInput);
    userEvent.type(descriptionInput, 'Updated description');

    // Submit the form to update the book
    const submitButton = screen.getByText('Submit');
    userEvent.click(submitButton);

    // Wait for the book to be updated and check the updated values
    await waitFor(() => {
      expect(screen.getByText('Updated Book Title')).toBeInTheDocument();
      expect(screen.getByText('Updated Author')).toBeInTheDocument();
    });
  });

  test('deletes a book', async () => {
    renderAdminDashboard();

    // Find the delete button for the first book
    const deleteButton = screen.getAllByText('Delete')[0];

    // Confirm the deletion
    window.confirm = jest.fn().mockReturnValue(true);

    // Click the delete button
    userEvent.click(deleteButton);

    // Wait for the book to be removed from the list
    await waitFor(() => {
      expect(screen.queryByText('Book 1')).not.toBeInTheDocument();
    });
  });
});
