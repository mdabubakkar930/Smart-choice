import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import SmartphoneCard from '../components/SmartphoneCard'
import FilterControls from '../components/FilterControls'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog'
import { getSmartphones, createSmartphone, updateSmartphone, deleteSmartphone, getBrands } from '../utils/api'

const SmartphoneManagement = () => {
  const [smartphones, setSmartphones] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showDialog, setShowDialog] = useState(false)
  const [editingPhone, setEditingPhone] = useState(null)
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

  const [formData, setFormData] = useState({
    brand: '',
    model_name: '',
    price: '',
    ram: '',
    storage: '',
    battery: '',
    rating: ''
  })

  useEffect(() => {
    fetchData()
    fetchBrands()
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

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
  }

  const handleAdd = () => {
    setEditingPhone(null)
    setFormData({
      brand: '',
      model_name: '',
      price: '',
      ram: '',
      storage: '',
      battery: '',
      rating: ''
    })
    setShowDialog(true)
  }

  const handleEdit = (smartphone) => {
    setEditingPhone(smartphone)
    setFormData({
      brand: smartphone.brand,
      model_name: smartphone.model_name,
      price: smartphone.price.toString(),
      ram: smartphone.ram.toString(),
      storage: smartphone.storage.toString(),
      battery: smartphone.battery.toString(),
      rating: smartphone.rating.toString()
    })
    setShowDialog(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this smartphone?')) {
      return
    }

    try {
      await deleteSmartphone(id)
      setSmartphones(smartphones.filter(phone => phone.id !== id))
    } catch (err) {
      setError('Failed to delete smartphone')
      console.error(err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const phoneData = {
        brand: formData.brand,
        model_name: formData.model_name,
        price: parseFloat(formData.price),
        ram: parseInt(formData.ram),
        storage: parseInt(formData.storage),
        battery: parseInt(formData.battery),
        rating: parseFloat(formData.rating)
      }

      if (editingPhone) {
        const updatedPhone = await updateSmartphone(editingPhone.id, phoneData)
        setSmartphones(smartphones.map(phone => 
          phone.id === editingPhone.id ? updatedPhone : phone
        ))
      } else {
        const newPhone = await createSmartphone(phoneData)
        setSmartphones([newPhone, ...smartphones])
      }

      setShowDialog(false)
      fetchBrands() // Refresh brands in case a new one was added
    } catch (err) {
      setError('Failed to save smartphone')
      console.error(err)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Smartphone Management</h1>
          <p className="text-gray-600 mt-2">Manage your smartphone inventory</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Smartphone
        </Button>
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
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading smartphones...</p>
        </div>
      ) : (
        /* Smartphone Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {smartphones.map((smartphone) => (
            <SmartphoneCard
              key={smartphone.id}
              smartphone={smartphone}
              onEdit={handleEdit}
              onDelete={handleDelete}
              showActions={true}
            />
          ))}
        </div>
      )}

      {smartphones.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-600">No smartphones found. Add one to get started!</p>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPhone ? 'Edit Smartphone' : 'Add New Smartphone'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="model_name">Model Name</Label>
              <Input
                id="model_name"
                value={formData.model_name}
                onChange={(e) => handleInputChange('model_name', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ram">RAM (GB)</Label>
                <Input
                  id="ram"
                  type="number"
                  value={formData.ram}
                  onChange={(e) => handleInputChange('ram', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="storage">Storage (GB)</Label>
                <Input
                  id="storage"
                  type="number"
                  value={formData.storage}
                  onChange={(e) => handleInputChange('storage', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="battery">Battery (mAh)</Label>
                <Input
                  id="battery"
                  type="number"
                  value={formData.battery}
                  onChange={(e) => handleInputChange('battery', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="rating">Rating (0-5)</Label>
                <Input
                  id="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => handleInputChange('rating', e.target.value)}
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingPhone ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SmartphoneManagement
