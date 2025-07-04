import { useState } from 'react'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'

const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch, 
  className = '' 
}) => {
  const [query, setQuery] = useState('')
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(query)
    }
  }
  
  const handleChange = (e) => {
    const value = e.target.value
    setQuery(value)
    
    // Debounced search
    if (onSearch) {
      const timeoutId = setTimeout(() => {
        onSearch(value)
      }, 300)
      
      return () => clearTimeout(timeoutId)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <ApperIcon 
          name="Search" 
          size={20} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" 
        />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          className="pl-10 pr-4"
        />
      </div>
    </form>
  )
}

export default SearchBar