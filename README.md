
# Book Inventory System - Frontend
This project provides the frontend for the Book Inventory System, built using React and Vite for fast development and optimized performance. The frontend connects to the backend through RESTful API endpoints to manage users, books, and roles.

### Key Features:
- User authentication (Login/Sign-Up) with role-based access (Admin/User).
- Admin dashboard to manage books.
- Book search and pagination.
- Add, update, and delete books.
- Responsive UI using Material UI.

## Architecture Overview

1. Frontend Framework: React with Vite

- I choose React with Vite for its modern development experience and performance optimization. Vite offers fast build times, fast hot module replacement, and supports out-of-the-box support for JSX and TypeScript. React was chosen due to its declarative and component-based structure, making it ideal for building maintainable UIs. React's large community and ecosystem also provide extensive resources.

2. State Management: Context API

- I implemented state management using React's Context API, which enables us to manage authentication and book data globally across components without the need for third-party libraries like Redux. Context API is efficient for this small-to-medium size application where global state management is needed.

- AuthContext
The AuthContext manages the user's authentication state (login/logout) and stores token and role in localStorage for persistence.
## Usage/Examples

```javascript
// AuthContext Example
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ token: string | null; role: string | null } | null>(null);
  const login = useCallback((token: string, role: string) => { /*...*/ }, []);
  const logout = useCallback(() => { /*...*/ }, []);
  const contextValue = useMemo(() => ({ user, login, logout }), [user, login, logout]);
  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

```

3. Design Patterns:
I have used various design patterns to ensure modularity and maintainability:

- Factory Pattern: Used in the AddBookForm component to handle the dynamic generation of form fields based on book attributes.
- Singleton Pattern: Applied in the AuthContext to ensure that there is a single instance of the authentication state.
- Observer Pattern: Implemented when updating the book list after adding, editing, or deleting a book.
4. UI Library: Material UI

- Material UI was chosen for its rich set of components that offer consistency and high-quality design. Components like Button, TextField, and Snackbar provide easy access to responsive and accessible UI elements, making development faster.

5. Routing: React Router
- React Router was used to handle routing in the application. It allows the app to switch between different views, like the login page, admin dashboard, and user dashboard, while maintaining the application’s state.

6. Component Breakdown:
  - Authentication:

- `Login.tsx`: Handles user login, validates form inputs, and manages API requests.
- `SignUp.tsx`: Allows users to create an account.
- `PrivateRoute.tsx`: A higher-order component to protect private routes based on user authentication.
- Admin Dashboard:

- `AdminDashboard.tsx`: Provides functionality to view, add, update, and delete books.
- `AddBookForm.tsx`: A form for adding or updating books.

- `BookTable.tsx`: Displays books in a paginated table.


7. Performance Optimization:
- Lazy Loading & Code Splitting: The application uses lazy loading to load components only when required, reducing initial load time. Vite handles code splitting automatically, optimizing the bundle size.
- React.memo: I used React.memo to prevent unnecessary re-renders of components that do not depend on changing state.
- Pagination: The book list is paginated, improving performance by limiting the number of books rendered at once.

8. Deployment:
- The frontend has been deployed on Vercel, leveraging CI/CD integration with GitHub Actions. Each push to the main branch automatically triggers deployment after successful tests.

- Deployment Steps:
- Push changes to the GitHub repository.
- Vercel automatically deploys the application.
- GitHub Actions automate the testing and deployment process.

  [You can access the deployed application here.](https://book-inventory-system-frontend.vercel.app/login)

 9. Testing:
- Unit tests have been implemented using Jest and React Testing Library to ensure that the components function as expected. Tests are written for the following:

- Login and Sign-Up form validation.
- Admin Dashboard functionalities like adding, deleting, and updating books.

10. Code Quality:
- ESLint and Prettier are configured to enforce consistent code style.
- Performance optimizations like React.memo and use of the useCallback hook ensure minimal unnecessary re-renders.
## Run Locally 

Clone the project

```bash
  git clone https://github.com/FayasAhmed-98/book-inventory-system-frontend

```

Go to the project directory

```bash
  book-inventory-system-frontend
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```


## Folder Structure:
```css
src/
├── assets/
│   └── react.svg
├── components/
│   ├── AddBookForm.tsx
│   ├── PrivateRoute.tsx
├── context/
│   ├── AuthContext.tsx
│   ├── BooksContext.tsx
├── feature/
│   ├── auth/
│   │   ├── Login.tsx
│   │   ├── Login.css            
│   │   ├── SignUp.tsx
│   │   ├── SignUp.css            
│   └── book-management/
│       ├── AdminDashboard.tsx
│       ├── AdminDashboard.css    
│       ├── UserDashboard.tsx     
│       ├── UserDashboard.css    
├── tests/
│   ├── auth/
│   │   ├── Login.test.tsx
│   │   ├── SignUp.test.tsx
│   └── book-management/
│       ├── AdminDashboard.test.tsx 
└── App.tsx



```
