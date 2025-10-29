# Frontend Structure

## Folder Organization

```
src/
├── components/      # Reusable React components
│   └── PrivateRoute.jsx
├── pages/          # Page-level components
│   ├── Login.jsx
│   ├── Register.jsx
│   └── Dashboard.jsx
├── context/        # React Context for state management
│   └── AuthContext.jsx
├── services/       # API service layer
│   ├── api.js
│   ├── authService.js
│   ├── transactionService.js
│   └── userService.js
├── utils/          # Utility functions
│   └── helpers.js
├── App.jsx         # Main App component with routing
└── index.jsx       # React entry point
```

## Dependencies Installed

- **react-router-dom**: Client-side routing
- **axios**: HTTP client for API calls
- **recharts**: Chart library for pie charts and analytics

## Environment Variables

Create a `.env` file in the frontend directory:

```
REACT_APP_API_URL=http://localhost:5000/api
```

## Available Scripts

- `npm start`: Start development server on port 3000
- `npm run build`: Create production build
- `npm test`: Run tests
- `npm run eject`: Eject from Create React App

## Features

### Authentication

- JWT token storage in localStorage
- Automatic token injection in API requests
- Auto-redirect on 401 (unauthorized)
- Protected routes with PrivateRoute component

### State Management

- AuthContext for global auth state
- User data persistence

### API Services

- Centralized API configuration
- Service layer for auth, transactions, and user operations
- Request/response interceptors

## Next Steps

1. **Task 9**: Implement authentication UI (Login/Register forms)
2. **Task 10**: Build dashboard layout with transaction form
3. **Task 11**: Add transaction list with edit/delete
4. **Task 12**: Integrate pie chart analytics
5. **Task 13**: Add budget alerts

## Running the App

1. Ensure backend is running on port 5000
2. Run `npm start` in the frontend directory
3. Navigate to `http://localhost:3000`
