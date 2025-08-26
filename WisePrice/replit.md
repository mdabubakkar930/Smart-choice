# Overview

PriceWise is a full-stack smartphone price comparison platform that allows users to browse, search, and compare smartphone specifications and prices. The application features a React frontend with a FastAPI backend, providing CRUD operations for smartphone data management, advanced filtering capabilities, and admin authentication for data management. The system includes CSV import/export functionality for bulk data operations and a responsive design optimized for both desktop and mobile devices.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built as a Single Page Application (SPA) using React 18 with Vite as the build tool and development server. The application uses React Router for client-side routing and Axios for HTTP client communication with the backend API. The UI is styled with TailwindCSS utility classes and enhanced with shadcn/ui components for a modern, consistent design system. The frontend runs on port 5000 and communicates with the backend through RESTful API calls.

## Backend Architecture
The backend follows a FastAPI-based REST API architecture with clear separation of concerns:
- **Main Application**: FastAPI app with CORS middleware for cross-origin requests
- **Database Layer**: SQLAlchemy ORM with declarative base models for data persistence
- **Authentication**: JWT-based authentication system with bcrypt password hashing
- **Route Organization**: Modular router structure separating auth and smartphone endpoints
- **Data Processing**: Pandas integration for CSV import/export operations

The backend uses dependency injection for database sessions and authentication, ensuring clean separation between business logic and data access.

## Data Storage
The application uses SQLite as the primary database, configured through SQLAlchemy ORM. The database schema includes:
- **Users table**: Stores admin credentials with email, hashed passwords, and role information
- **Smartphones table**: Contains smartphone specifications including brand, model, price, RAM, storage, battery, and rating data

The system supports both SQLite (default) and PostgreSQL through environment configuration, allowing for easy deployment scaling.

## Authentication & Authorization
Implements JWT-based authentication with the following security measures:
- Password hashing using bcrypt for secure credential storage
- Token-based authentication with configurable expiration times
- Admin role-based access control for data management operations
- HTTP Bearer token authentication for API endpoints
- Client-side token validation and automatic logout on expiration

## API Design
RESTful API structure with clear endpoint organization:
- Authentication endpoints under `/api/auth/`
- Smartphone CRUD operations under `/api/smartphones/`
- Advanced filtering and search capabilities with query parameters
- CSV import/export endpoints for bulk data management
- Standardized response formats with proper HTTP status codes

# External Dependencies

## Backend Dependencies
- **FastAPI**: Modern Python web framework for building APIs
- **SQLAlchemy**: SQL toolkit and ORM for database operations
- **Pandas**: Data analysis library for CSV processing and bulk operations
- **Passlib[bcrypt]**: Password hashing library with bcrypt support
- **Python-jose**: JWT token creation and validation
- **Uvicorn**: ASGI server for running the FastAPI application

## Frontend Dependencies
- **React**: Core UI library for component-based architecture
- **React Router DOM**: Client-side routing for SPA navigation
- **Axios**: HTTP client for API communication
- **TailwindCSS**: Utility-first CSS framework for styling
- **shadcn/ui Components**: Pre-built React components with consistent design
- **Lucide React**: Icon library for UI elements
- **Vite**: Build tool and development server

## Development Tools
- **ESLint**: Code linting for JavaScript/React
- **PostCSS**: CSS processing with Autoprefixer
- **Class Variance Authority**: Utility for component variant management
- **Tailwind Merge**: Utility for merging TailwindCSS classes

The application is designed to run in development mode with hot reloading on both frontend (port 5000) and backend (port 8000), with proper CORS configuration for local development.