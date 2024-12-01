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
  const { books } = useBooks(); // Access books data from the context
  const [searchTerm, setSearchTerm] = useState(""); // State for the search input
  const [page, setPage] = useState(0); // State for the current page in pagination
  const [rowsPerPage, setRowsPerPage] = useState(5); // State for the number of rows per page
  const navigate = useNavigate(); // Hook to navigate to different routes

  // Filter books based on the search term entered by the user
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle page change for pagination
  const handleChangePage = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  // Handle rows per page change and reset to the first page
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  };

  // Calculate the books to display based on pagination
  const paginatedBooks = filteredBooks.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Handle logout and navigate back to the login page
  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <Container>
      {/* AppBar with title and logout button */}
      <AppBar position="static" className="app-bar">
        <Toolbar className="toolbar">
          <Typography variant="h6" className="title">
            User Dashboard
          </Typography>
          <Button className="logout-button" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Search bar for filtering books */}
      <Box className="search-bar">
        <TextField
          label="Search Books"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update the search term as user types
          InputProps={{
            endAdornment: <SearchIcon />, // Add a search icon to the input field
          }}
        />
      </Box>

      {/* Table to display books */}
      <div className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Genre</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Map through the books and display each one in a table row */}
            {paginatedBooks.map((book) => (
              <TableRow key={book.id}>
                <TableCell className="title">{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.genre}</TableCell>
                <TableCell>{book.description}</TableCell>
                <TableCell className="price">
                  ${book.price.toFixed(2)}
                </TableCell>
                <TableCell className="stock">{book.stock}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls for navigating through pages */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]} // Options for rows per page
        component="div" // Indicate this controls a table
        count={filteredBooks.length} // Total number of filtered books
        rowsPerPage={rowsPerPage} // Current rows per page
        page={page} // Current page number
        onPageChange={handleChangePage} // Handler for page changes
        onRowsPerPageChange={handleChangeRowsPerPage} // Handler for rows per page changes
        className="pagination"
      />
    </Container>
  );
};

export default UserDashboard;
