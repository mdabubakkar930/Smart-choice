import React from 'react'
import { Filter, X } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Select, SelectItem } from './ui/select'
import { Label } from './ui/label'

const FilterControls = ({ filters, onFiltersChange, brands = [] }) => {
  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value === '' ? null : value
    })
  }

  const clearFilters = () => {
    onFiltersChange({
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
  }

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== null && value !== 'created_at' && value !== 'desc'
  )

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-medium">Filters & Search</h3>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {/* Search */}
        <div>
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search phones..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        {/* Brand */}
        <div>
          <Label htmlFor="brand">Brand</Label>
          <Select
            value={filters.brand || ''}
            onChange={(e) => handleFilterChange('brand', e.target.value)}
          >
            <SelectItem value="">All Brands</SelectItem>
            {brands.map(brand => (
              <SelectItem key={brand} value={brand}>{brand}</SelectItem>
            ))}
          </Select>
        </div>

        {/* Price Range */}
        <div>
          <Label htmlFor="min_price">Min Price</Label>
          <Input
            id="min_price"
            type="number"
            placeholder="Min"
            value={filters.min_price || ''}
            onChange={(e) => handleFilterChange('min_price', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="max_price">Max Price</Label>
          <Input
            id="max_price"
            type="number"
            placeholder="Max"
            value={filters.max_price || ''}
            onChange={(e) => handleFilterChange('max_price', e.target.value)}
          />
        </div>

        {/* RAM Range */}
        <div>
          <Label htmlFor="min_ram">Min RAM (GB)</Label>
          <Input
            id="min_ram"
            type="number"
            placeholder="Min RAM"
            value={filters.min_ram || ''}
            onChange={(e) => handleFilterChange('min_ram', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="max_ram">Max RAM (GB)</Label>
          <Input
            id="max_ram"
            type="number"
            placeholder="Max RAM"
            value={filters.max_ram || ''}
            onChange={(e) => handleFilterChange('max_ram', e.target.value)}
          />
        </div>

        {/* Storage Range */}
        <div>
          <Label htmlFor="min_storage">Min Storage (GB)</Label>
          <Input
            id="min_storage"
            type="number"
            placeholder="Min Storage"
            value={filters.min_storage || ''}
            onChange={(e) => handleFilterChange('min_storage', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="max_storage">Max Storage (GB)</Label>
          <Input
            id="max_storage"
            type="number"
            placeholder="Max Storage"
            value={filters.max_storage || ''}
            onChange={(e) => handleFilterChange('max_storage', e.target.value)}
          />
        </div>

        {/* Rating Range */}
        <div>
          <Label htmlFor="min_rating">Min Rating</Label>
          <Input
            id="min_rating"
            type="number"
            step="0.1"
            min="0"
            max="5"
            placeholder="Min Rating"
            value={filters.min_rating || ''}
            onChange={(e) => handleFilterChange('min_rating', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="max_rating">Max Rating</Label>
          <Input
            id="max_rating"
            type="number"
            step="0.1"
            min="0"
            max="5"
            placeholder="Max Rating"
            value={filters.max_rating || ''}
            onChange={(e) => handleFilterChange('max_rating', e.target.value)}
          />
        </div>

        {/* Sort */}
        <div>
          <Label htmlFor="sort_by">Sort By</Label>
          <Select
            value={filters.sort_by || 'created_at'}
            onChange={(e) => handleFilterChange('sort_by', e.target.value)}
          >
            <SelectItem value="created_at">Date Added</SelectItem>
            <SelectItem value="price">Price</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
            <SelectItem value="brand">Brand</SelectItem>
            <SelectItem value="model_name">Model</SelectItem>
          </Select>
        </div>

        <div>
          <Label htmlFor="sort_order">Order</Label>
          <Select
            value={filters.sort_order || 'desc'}
            onChange={(e) => handleFilterChange('sort_order', e.target.value)}
          >
            <SelectItem value="desc">Descending</SelectItem>
            <SelectItem value="asc">Ascending</SelectItem>
          </Select>
        </div>
      </div>
    </div>
  )
}

export default FilterControls
