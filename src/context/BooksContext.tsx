import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import axios from 'axios';

// Interface for a Book object
export interface Book {
  id?: number; // Optional ID, required for updates and deletes
  title: string; // Book title
  author: string; // Book author
  genre: string; // Book genre
  description: string; // Book description
  price: number; // Book price
  stock: number; // Available stock
}

// Interface for the context structure
interface BooksContextType {
  books: Book[]; // Array of books
  addBook: (newBook: Book) => Promise<void>; // Function to add a new book
  deleteBook: (id: number) => void; // Function to delete a book
  updateBook: (updatedBook: Book) => Promise<void>; // Function to update a book
  error: string | null; // Error message, if any
  setError: (message: string) => void; // Function to set error message
}

// Creating the BooksContext
const BooksContext = createContext<BooksContextType | undefined>(undefined);

// Custom hook to use BooksContext
export const useBooks = (): BooksContextType => {
  const context = useContext(BooksContext);
  if (!context) {
    throw new Error('useBooks must be used within a BooksProvider'); // Ensures hook is used inside a provider
  }
  return context;
};

// BooksProvider component to wrap the application with context
export const BooksProvider: React.FC = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]); // State to store books
  const [error, setError] = useState<string | null>(null); // State to store error messages

  // Fetch books on component mount
  useEffect(() => {
    const fetchBooks = async () => {
      const token = localStorage.getItem('token'); // Get token from local storage
      try {
        const response = await axios.get('http://localhost:8080/books/view', {
          headers: { Authorization: `Bearer ${token}` }, // Attach token for authentication
        });
        setBooks(response.data); // Update books state with fetched data
        setError(null); // Clear error on success
      } catch (err) {
        setError('Failed to fetch books. Please try again later.'); // Set error message
        console.error('Error fetching books:', err); // Log error to console
      }
    };

    fetchBooks(); // Call the fetch function
  }, []);

  // Memoized function to add a new book
  const addBook = useCallback(async (newBook: Book) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('http://localhost:8080/books/add', newBook, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks((prevBooks) => [...prevBooks, response.data]); // Add new book to the state
      setError(null); // Clear error on success
    } catch (err) {
      setError('Failed to add book. Please check your input and try again.');
      console.error('Error adding book:', err);
    }
  }, []);

  // Memoized function to update an existing book
  const updateBook = useCallback(async (updatedBook: Book) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:8080/books/update/${updatedBook.id}`, updatedBook, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks((prevBooks) =>
        prevBooks.map((book) => (book.id === updatedBook.id ? updatedBook : book))
      ); // Replace the updated book in the state
      setError(null); // Clear error on success
    } catch (err) {
      setError('Failed to update book. Please check your input and try again.');
      console.error('Error updating book:', err);
    }
  }, []);

  // Memoized function to delete a book
  const deleteBook = useCallback(async (id: number) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:8080/books/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id)); // Remove the deleted book from state
      setError(null); // Clear error on success
    } catch (err) {
      setError('Failed to delete book. Please try again later.');
      console.error('Error deleting book:', err);
    }
  }, []);

  // Memoized context value
  const contextValue = useMemo(
    () => ({ books, addBook, updateBook, deleteBook, error, setError }),
    [books, addBook, updateBook, deleteBook, error]
  );

  return <BooksContext.Provider value={contextValue}>{children}</BooksContext.Provider>;
};
