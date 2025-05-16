# Task Manager Application

A modern web application for managing tasks with user authentication, built using React and Vite.

## Features

-   **User Authentication**

    -   Secure login and registration system
    -   JWT token-based authentication
    -   Protected routes for authenticated users

-   **Task Management**

    -   Create, read, update, and delete tasks
    -   Task properties include:
        -   Title
        -   Description
        -   Status (Pending, Ongoing, Completed, Overdue)
        -   Priority (High, Medium, Low)
        -   Due Date

-   **User Interface**
    -   Clean and responsive design
    -   Search functionality for tasks
    -   Filter tasks by status, priority, and due date
    -   Modal windows for task creation and editing
    -   Loading indicators for better user experience
    -   Toast notifications for action feedback

## Tech Stack

-   **Frontend**
    -   React 18
    -   Redux Toolkit (State Management)
    -   React Router v6 (Navigation)
    -   Axios (API Requests)
    -   React Modal
    -   React Toastify
    -   FontAwesome Icons
    -   CSS Modules (Styling)

## Getting Started

### Prerequisites

-   Node.js (version 14 or higher)
-   npm or yarn

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd task-manager/client
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```
VITE_NODE_ENV=development
VITE_BACKEND_URL=<your-backend-url>
VITE_TOKEN_SECRET=<your-secret-key>
```

4. Start the development server

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── assets/         # Static assets
├── components/     # Reusable components
│   ├── loader/     # Loading indicators
│   └── Root.jsx    # Root component
├── redux/         # Redux state management
│   ├── store.js
│   └── slices/
├── views/         # Page components
│   ├── home/
│   ├── login/
│   ├── register/
│   └── tasks/
└── App.jsx        # Main application component
```

## Features in Detail

### Authentication

-   User registration with name, email, and password
-   Secure login system
-   Automatic token verification
-   Protected routes for authenticated users

### Task Management

-   Comprehensive task CRUD operations
-   Real-time task updates
-   Detailed task information display
-   Task filtering and search capabilities

### UI/UX

-   Responsive design for all screen sizes
-   Interactive modals for task operations
-   Loading states for better user feedback
-   Error handling with toast notifications
-   Clean and intuitive interface

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
