import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

// Create Context for Books
export interface Book {
  id?: number;
  title: string;
  author: string;
  genre: string;
  description: string;
  price: number;
  stock: number;
}

interface BooksContextType {
  books: Book[];
  addBook: (newBook: Book) => Promise<void>;
  deleteBook: (id: number) => void;
  updateBook: (updatedBook: Book) => Promise<void>; 
  error: string | null;  // To store error messages
  setError: (message: string) => void;  // To set error messages
}

const BooksContext = createContext<BooksContextType | undefined>(undefined);

export const useBooks = () => {
  const context = useContext(BooksContext);
  if (!context) {
    throw new Error("useBooks must be used within a BooksProvider");
  }
  return context;
};

export const BooksProvider: React.FC = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null); // State for error messages

  useEffect(() => {
    const fetchBooks = async () => {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      try {
        const response = await axios.get("http://localhost:8080/books/view", {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the token here
          },
        });
        setBooks(response.data);
      } catch (error) {
        setError("Failed to fetch books. Please try again later.");
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  const addBook = async (newBook: Book) => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    try {
      await axios.post(
        "http://localhost:8080/books/add",
        newBook,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the token here
          },
        }
      );
      setBooks((prevBooks) => [...prevBooks, newBook]); // Update the books list
      setError(null); // Clear any previous errors
    } catch (error) {
      setError("Failed to add book. Please check your input and try again.");
      console.error("Failed to add book:", error);
    }
  };

  const updateBook = async (updatedBook: Book) => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    try {
      await axios.put(
        `http://localhost:8080/books/update/${updatedBook.id}`,
        updatedBook,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the token here
          },
        }
      );
      setBooks((prevBooks) =>
        prevBooks.map((book) => (book.id === updatedBook.id ? updatedBook : book))
      ); // Update the specific book
      setError(null); // Clear any previous errors
    } catch (error) {
      setError("Failed to update book. Please check your input and try again.");
      console.error("Failed to update book:", error);
    }
  };

  const deleteBook = async (id: number) => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    try {
      await axios.delete(`http://localhost:8080/books/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach the token here
        },
      });
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id)); // Remove the deleted book
      setError(null); // Clear any previous errors
    } catch (error) {
      setError("Failed to delete book. Please try again later.");
      console.error("Failed to delete book:", error);
    }
  };

  return (
    <BooksContext.Provider
      value={{ books, addBook, updateBook, deleteBook, error, setError }}
    >
      {children}
    </BooksContext.Provider>
  );
};

