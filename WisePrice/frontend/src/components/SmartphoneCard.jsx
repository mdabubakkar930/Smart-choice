import React from 'react'
import { Star, Smartphone, HardDrive, Battery, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'

const SmartphoneCard = ({ smartphone, onEdit, onDelete, showActions = false }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const renderRating = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        <span className="text-sm font-medium">{rating}</span>
      </div>
    )
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">
              {smartphone.model_name}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">{smartphone.brand}</p>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {formatPrice(smartphone.price)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-gray-500" />
            <span>{smartphone.ram}GB RAM</span>
          </div>
          <div className="flex items-center space-x-2">
            <HardDrive className="h-4 w-4 text-gray-500" />
            <span>{smartphone.storage}GB</span>
          </div>
          <div className="flex items-center space-x-2">
            <Battery className="h-4 w-4 text-gray-500" />
            <span>{smartphone.battery}mAh</span>
          </div>
          <div className="flex items-center space-x-2">
            {renderRating(smartphone.rating)}
          </div>
        </div>

        {showActions && (
          <div className="flex space-x-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(smartphone)}
              className="flex-1"
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(smartphone.id)}
              className="flex-1"
            >
              Delete
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default SmartphoneCard
