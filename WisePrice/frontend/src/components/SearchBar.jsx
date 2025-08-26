import React from 'react'
import { Search } from 'lucide-react'
import { Input } from './ui/input'

const SearchBar = ({ value, onChange, placeholder = "Search phones..." }) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10"
      />
    </div>
  )
}

export default SearchBar
