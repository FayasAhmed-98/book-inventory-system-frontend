import React, { useState, useEffect } from "react";
import { useBooks, Book } from "../context/BooksContext";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

interface AddBookFormProps {
  open: boolean;
  onClose: () => void;
  initialBook?: Book | null; // For updating books
  onAction?: (message: string) => void; // Callback for notification messages
}

const AddBookForm: React.FC<AddBookFormProps> = ({
  open,
  onClose,
  initialBook = null,
  onAction,
}) => {
  const { addBook, updateBook } = useBooks();

  // State for the book and validation errors
  const [book, setBook] = useState<Book>(
    initialBook || { title: "", author: "", genre: "", description: "", price: 0, stock: 0, image: "" }
  );

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setBook(
      initialBook || { title: "", author: "", genre: "", description: "", price: 0, stock: 0, image: "" }
    );
    setErrors({}); // Reset errors when the dialog opens
  }, [initialBook]);

  // Validation function
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!book.title.trim()) newErrors.title = "Title is required.";
    if (!book.author.trim()) newErrors.author = "Author is required.";
    if (!book.genre.trim()) newErrors.genre = "Genre is required.";
    if (!book.description.trim()) newErrors.description = "Description is required.";
    if (book.price <= 0) newErrors.price = "Price must be greater than 0.";
    if (book.stock < 0) newErrors.stock = "Stock cannot be negative.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSave = async () => {
    if (!validate()) return; // Prevent saving if validation fails

    if (book.id) {
      await updateBook(book);
      onAction?.("Book updated successfully!");
    } else {
      await addBook(book);
      onAction?.("Book added successfully!");
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{book.id ? "Update Book" : "Add New Book"}</DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          fullWidth
          value={book.title}
          onChange={(e) => setBook({ ...book, title: e.target.value })}
          error={!!errors.title} // Show error state
          helperText={errors.title} // Show error message
          style={{ marginBottom: "10px" }}
        />
        <TextField
          label="Author"
          fullWidth
          value={book.author}
          onChange={(e) => setBook({ ...book, author: e.target.value })}
          error={!!errors.author}
          helperText={errors.author}
          style={{ marginBottom: "10px" }}
        />
        <TextField
          label="Genre"
          fullWidth
          value={book.genre}
          onChange={(e) => setBook({ ...book, genre: e.target.value })}
          error={!!errors.genre}
          helperText={errors.genre}
          style={{ marginBottom: "10px" }}
        />
        <TextField
          label="Description"
          fullWidth
          multiline
          rows={4}
          value={book.description}
          onChange={(e) => setBook({ ...book, description: e.target.value })}
          error={!!errors.description}
          helperText={errors.description}
          style={{ marginBottom: "10px" }}
        />
        <TextField
          label="Price"
          fullWidth
          value={book.price}
          onChange={(e) => setBook({ ...book, price: parseFloat(e.target.value) })}
          type="number"
          error={!!errors.price}
          helperText={errors.price}
          style={{ marginBottom: "10px" }}
        />
        <TextField
          label="Stock"
          fullWidth
          value={book.stock}
          onChange={(e) => setBook({ ...book, stock: parseInt(e.target.value) })}
          type="number"
          error={!!errors.stock}
          helperText={errors.stock}
          style={{ marginBottom: "10px" }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          {book.id ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddBookForm;
