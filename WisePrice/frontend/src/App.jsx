import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { isAuthenticated, getUser } from './utils/auth'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import SmartphoneManagement from './pages/SmartphoneManagement'
import CSVUpload from './pages/CSVUpload'
import CSVExport from './pages/CSVExport'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check authentication status on app load
    if (isAuthenticated()) {
      setUser(getUser())
    }
    setLoading(false)
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Navbar user={user} onLogout={handleLogout} />}
      
      <Routes>
        <Route 
          path="/login" 
          element={
            !user ? 
            <LoginPage onLogin={handleLogin} /> : 
            <Navigate to="/" replace />
          } 
        />
        
        <Route 
          path="/" 
          element={
            user ? 
            <Dashboard /> : 
            <Navigate to="/login" replace />
          } 
        />
        
        <Route 
          path="/manage" 
          element={
            user && user.is_admin ? 
            <SmartphoneManagement /> : 
            <Navigate to="/" replace />
          } 
        />
        
        <Route 
          path="/upload" 
          element={
            user && user.is_admin ? 
            <CSVUpload /> : 
            <Navigate to="/" replace />
          } 
        />
        
        <Route 
          path="/export" 
          element={
            user && user.is_admin ? 
            <CSVExport /> : 
            <Navigate to="/" replace />
          } 
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
