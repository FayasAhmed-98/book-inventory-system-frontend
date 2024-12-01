import React, { useState } from "react";
import { useBooks } from "../../context/BooksContext";
import AddBookForm from "../../components/AddBookForm";
import {
  Container,
  TextField,
  TablePagination,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon } from "@mui/icons-material";
import "./AdminDashboard.css";

const AdminDashboard: React.FC = () => {
  const { books, deleteBook } = useBooks();
  const [openAddBookDialog, setOpenAddBookDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [notification, setNotification] = useState({ message: "", type: "success" });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedBooks = filteredBooks.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleLogout = () => {
    navigate("/login");
  };

  const handleDelete = async (id: number) => {
    await deleteBook(id);
    setNotification({ message: "Book deleted successfully!", type: "info" });
    setOpenSnackbar(true);
  };

  const handleEdit = (book: any) => {
    setSelectedBook(book);
    setOpenAddBookDialog(true);
  };

  const handleAction = (message: string) => {
    setNotification({ message, type: "success" });
    setOpenSnackbar(true);
  };

  return (
    <Container>
      {/* Navbar */}
      <div className="navbar">
        <h1>Admin Dashboard</h1>
        <div>
          <button
            className="add-book"
            onClick={() => setOpenAddBookDialog(true)}
          >
            Add Book
          </button>
          <button className="logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <TextField
          label="Search Books"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            maxWidth: 600,
            borderRadius: "20px",
            '& .MuiOutlinedInput-root': {
              borderRadius: "20px",
            },
            '& .MuiInputLabel-root': {
              fontWeight: "bold",
            },
          }}
          InputProps={{
            endAdornment: <SearchIcon sx={{ color: "#1976d2" }} />,
          }}
        />
      </Box>

      {/* Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Author</th>
              <th>Genre</th>
              <th>Description</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBooks.map((book) => (
              <tr key={book.id}>
                <td>
                  <img
                    src={book.image || "https://via.placeholder.com/50"}
                    alt={book.title}
                  />
                </td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.genre}</td>
                <td>{book.description}</td>
                <td>${book.price.toFixed(2)}</td>
                <td>{book.stock}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="update"
                      onClick={() => handleEdit(book)}
                    >
                      Update
                    </button>
                    <button
                      className="delete"
                      onClick={() => handleDelete(book.id!)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filteredBooks.length}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25]}
        className="pagination-container"
      />

      {/* Add Book Dialog */}
      <AddBookForm
        open={openAddBookDialog}
        onClose={() => {
          setOpenAddBookDialog(false);
          setSelectedBook(null);
        }}
        initialBook={selectedBook}
        onAction={handleAction}
      />

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity={notification.type}>{notification.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminDashboard;
