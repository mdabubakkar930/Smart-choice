import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LogOut, Smartphone, Upload, Download, Settings } from 'lucide-react'
import { Button } from './ui/button'

const Navbar = ({ user, onLogout }) => {
  const location = useLocation()

  const navigation = [
    { name: 'Home', href: '/', icon: Smartphone },
    ...(user.is_admin ? [
      { name: 'Manage', href: '/manage', icon: Settings },
      { name: 'Upload CSV', href: '/upload', icon: Upload },
      { name: 'Export CSV', href: '/export', icon: Download },
    ] : [])
  ]

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-600">SmartChoice</h1>
            </Link>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              Welcome, {user.email}
            </span>
            {user.is_admin && (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                Admin
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-gray-500 hover:text-gray-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center">
                  <Icon className="h-4 w-4 mr-2" />
                  {item.name}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
