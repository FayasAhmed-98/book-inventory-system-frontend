import React, { useState } from "react";
import { useBooks } from "../../context/BooksContext";
import {
  Container,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  AppBar,
  Toolbar,
  Typography,
  Button,
  TablePagination,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon } from "@mui/icons-material";
import "./UserDashboard.css";

const UserDashboard: React.FC = () => {
  const { books } = useBooks();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0); // Current page
  const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page
  const navigate = useNavigate();

  // Filter books based on search term
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle page change
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page to the first page when rows per page changes
  };

  // Calculate the books to display for the current page
  const paginatedBooks = filteredBooks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Logout handler
  const handleLogout = () => {
    navigate("/login"); // Navigate to the login page
  };

  return (
    <Container>
      {/* AppBar with Logout button */}
      <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1, fontWeight: "bold" }}>
            User Dashboard
          </Typography>
          <Button
            color="inherit"
            onClick={handleLogout}
            sx={{
              backgroundColor: "#e53935",
              '&:hover': { backgroundColor: "#c62828" },
              fontSize: "1rem",
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

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
            '& .MuiOutlinedInput-root': { borderRadius: "20px" },
            '& .MuiInputLabel-root': { fontWeight: "bold" },
          }}
          InputProps={{
            endAdornment: <SearchIcon sx={{ color: "#1976d2" }} />,
          }}
        />
      </Box>

      {/* Books Table */}
      <div className="table-container">
        <Table sx={{ marginTop: "20px", borderCollapse: "collapse", width: "100%" }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#1976d2", color: "white" }}>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>Title</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>Author</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>Genre</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>Description</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>Price</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>Stock</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedBooks.map((book) => (
              <TableRow key={book.id}>
                <TableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.genre}</TableCell>
                <TableCell>{book.description}</TableCell>
                <TableCell sx={{ color: "#388e3c" }}>${book.price.toFixed(2)}</TableCell>
                <TableCell sx={{ color: "#ff5722" }}>{book.stock}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredBooks.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          backgroundColor: "#f5f5f5",
          borderTop: "1px solid #e0e0e0",
          padding: "10px",
        }}
      />
    </Container>
  );
};

export default UserDashboard;
