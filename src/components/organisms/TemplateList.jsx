import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import TemplateCard from '@/components/molecules/TemplateCard'
import SearchBar from '@/components/molecules/SearchBar'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { templateService } from '@/services/api/templateService'

const TemplateList = ({ 
  onEdit, 
  onDelete, 
  onGenerate, 
  onCreateNew,
  className = '' 
}) => {
  const [templates, setTemplates] = useState([])
  const [filteredTemplates, setFilteredTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  
  useEffect(() => {
    loadTemplates()
  }, [])
  
  useEffect(() => {
    if (searchQuery) {
      const filtered = templates.filter(template =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredTemplates(filtered)
    } else {
      setFilteredTemplates(templates)
    }
  }, [templates, searchQuery])
  
  const loadTemplates = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await templateService.getAll()
      setTemplates(data)
    } catch (err) {
      setError('Failed to load templates')
      console.error('Error loading templates:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const handleSearch = (query) => {
    setSearchQuery(query)
  }
  
  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
          <Loading type="shimmer" className="h-8 w-48" />
          <Loading type="shimmer" className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Loading key={i} type="shimmer" className="h-48 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={loadTemplates} 
        className={className}
      />
    )
  }
  
  if (templates.length === 0) {
    return (
      <Empty
        title="No templates found"
        description="Get started by creating your first document template. Connect your Airtable data with Google Docs to generate professional PDFs."
        icon="FileText"
        actionLabel="Create Template"
        onAction={onCreateNew}
        className={className}
      />
    )
  }
  
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <SearchBar
          placeholder="Search templates..."
          onSearch={handleSearch}
          className="w-full max-w-md"
        />
        
        <div className="text-sm text-slate-500">
          {filteredTemplates.length} of {templates.length} templates
        </div>
      </div>
      
      {filteredTemplates.length === 0 ? (
        <Empty
          title="No templates match your search"
          description="Try adjusting your search criteria or create a new template."
          icon="Search"
          actionLabel="Create Template"
          onAction={onCreateNew}
        />
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <TemplateCard
                template={template}
                onEdit={onEdit}
                onDelete={onDelete}
                onGenerate={onGenerate}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

export default TemplateList