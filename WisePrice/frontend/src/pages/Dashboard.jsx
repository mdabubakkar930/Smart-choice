import React, { useState, useEffect } from 'react'
import { Smartphone, TrendingUp, Star, DollarSign } from 'lucide-react'
import SmartphoneCard from '../components/SmartphoneCard'
import FilterControls from '../components/FilterControls'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { getSmartphones, getBrands, getStats } from '../utils/api'

const Dashboard = () => {
  const [smartphones, setSmartphones] = useState([])
  const [brands, setBrands] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    search: '',
    brand: '',
    min_price: '',
    max_price: '',
    min_ram: '',
    max_ram: '',
    min_storage: '',
    max_storage: '',
    min_rating: '',
    max_rating: '',
    sort_by: 'created_at',
    sort_order: 'desc'
  })

  useEffect(() => {
    fetchData()
    fetchBrands()
    fetchStats()
  }, [])

  useEffect(() => {
    fetchData()
  }, [filters])

  const fetchData = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== '' && filters[key] !== null) {
          params.append(key, filters[key])
        }
      })

      const data = await getSmartphones(params)
      setSmartphones(data)
    } catch (err) {
      setError('Failed to fetch smartphones')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchBrands = async () => {
    try {
      const data = await getBrands()
      setBrands(data)
    } catch (err) {
      console.error('Failed to fetch brands:', err)
    }
  }

  const fetchStats = async () => {
    try {
      const data = await getStats()
      setStats(data)
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
  }

  if (loading && smartphones.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading smartphones...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Find Your Perfect Smartphone
        </h1>
        <p className="text-gray-600 mt-2">
          Get personalized recommendations based on your needs and budget
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Phones</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_phones || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.average_price || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.average_rating || 0}/5
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <FilterControls
          filters={filters}
          onFiltersChange={handleFiltersChange}
          brands={brands}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="text-red-800">{error}</div>
        </div>
      )}

      {/* Results */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {smartphones.length} {smartphones.length === 1 ? 'phone' : 'phones'} found
        </h2>
        {smartphones.length === 0 && !loading && (
          <p className="text-gray-600 mt-2">
            No phones match your current filters. Try adjusting your search criteria.
          </p>
        )}
      </div>

      {/* Smartphone Grid */}
      {smartphones.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {smartphones.map((smartphone) => (
            <SmartphoneCard
              key={smartphone.id}
              smartphone={smartphone}
              showActions={false}
            />
          ))}
        </div>
      )}

      {loading && smartphones.length > 0 && (
        <div className="text-center mt-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Updating results...</p>
        </div>
      )}
    </div>
  )
}

export default Dashboard
