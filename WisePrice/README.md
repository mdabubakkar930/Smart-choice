# PriceWise - Smartphone Price Comparison Platform

A full-stack web application for comparing smartphone prices and specifications with admin management capabilities.

## Features

- 🔐 **JWT Authentication** - Secure admin login system
- 📱 **Smartphone Database** - Complete CRUD operations for smartphone management
- 🔍 **Advanced Search & Filtering** - Search by brand, price, RAM, storage, rating
- 📊 **Dashboard Analytics** - Statistics and overview of smartphone data
- 📤 **CSV Import/Export** - Bulk data management capabilities
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🎨 **Modern UI** - Clean design with TailwindCSS and shadcn/ui components

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **SQLite** - Lightweight database
- **JWT** - JSON Web Tokens for authentication
- **Pandas** - CSV data processing
- **Bcrypt** - Password hashing

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - Modern React components
- **Axios** - HTTP client
- **React Router** - Client-side routing

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install fastapi uvicorn sqlalchemy passlib[bcrypt] python-jose python-multipart pandas
   ```

3. **Start the backend server:**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   