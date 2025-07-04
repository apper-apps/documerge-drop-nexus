import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import FieldMappingRow from '@/components/molecules/FieldMappingRow'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { airtableService } from '@/services/api/airtableService'
import { googleDocsService } from '@/services/api/googleDocsService'

const FieldMappingPanel = ({ 
  airtableConfig, 
  googleDocUrl, 
  mappings = [], 
  onMappingsChange,
  className = ''
}) => {
  const [airtableFields, setAirtableFields] = useState([])
  const [docPlaceholders, setDocPlaceholders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  useEffect(() => {
    if (airtableConfig?.apiKey && airtableConfig?.baseId && airtableConfig?.tableName) {
      loadAirtableFields()
    }
  }, [airtableConfig])
  
  useEffect(() => {
    if (googleDocUrl) {
      loadDocPlaceholders()
    }
  }, [googleDocUrl])
  
  const loadAirtableFields = async () => {
    try {
      setLoading(true)
      setError('')
      const fields = await airtableService.getFields(airtableConfig)
      setAirtableFields(fields)
    } catch (err) {
      setError('Failed to load Airtable fields')
      toast.error('Failed to connect to Airtable')
    } finally {
      setLoading(false)
    }
  }
  
  const loadDocPlaceholders = async () => {
    try {
      setLoading(true)
      setError('')
      const placeholders = await googleDocsService.getPlaceholders(googleDocUrl)
      setDocPlaceholders(placeholders)
    } catch (err) {
      setError('Failed to load Google Docs placeholders')
      toast.error('Failed to parse Google Docs template')
    } finally {
      setLoading(false)
    }
  }
  
  const handleMappingUpdate = (updatedMapping) => {
    const newMappings = mappings.map(mapping =>
      mapping.docPlaceholder === updatedMapping.docPlaceholder ? updatedMapping : mapping
    )
    onMappingsChange(newMappings)
  }
  
  const handleMappingRemove = (mappingToRemove) => {
    const newMappings = mappings.filter(mapping => 
      mapping.docPlaceholder !== mappingToRemove.docPlaceholder
    )
    onMappingsChange(newMappings)
  }
  
  const handleAutoMap = () => {
    const autoMappings = docPlaceholders.map(placeholder => {
      const existingMapping = mappings.find(m => m.docPlaceholder === placeholder)
      if (existingMapping) return existingMapping
      
      // Try to find matching field by name
      const matchingField = airtableFields.find(field => 
        field.name.toLowerCase().includes(placeholder.toLowerCase().replace(/[{}]/g, ''))
      )
      
      return {
        docPlaceholder: placeholder,
        airtableField: matchingField?.name || '',
        fieldType: matchingField?.type || 'text',
        isLineItem: false
      }
    })
    
    onMappingsChange(autoMappings)
    toast.success('Auto-mapping completed')
  }
  
  if (loading) {
    return (
      <Card className={className}>
        <Loading type="skeleton" className="h-64" />
      </Card>
    )
  }
  
  if (error) {
    return (
      <Card className={className}>
        <Error 
          message={error} 
          onRetry={() => {
            loadAirtableFields()
            loadDocPlaceholders()
          }} 
        />
      </Card>
    )
  }
  
  if (docPlaceholders.length === 0) {
    return (
      <Card className={className}>
        <Empty
          title="No placeholders found"
          description="Make sure your Google Docs template contains placeholders like {{field_name}} that need to be mapped to Airtable fields."
          icon="Braces"
        />
      </Card>
    )
  }
  
  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Field Mapping</h3>
          <p className="text-sm text-slate-600">
            Map Google Docs placeholders to Airtable fields
          </p>
        </div>
        
        <Button
          variant="secondary"
          size="sm"
          onClick={handleAutoMap}
          disabled={airtableFields.length === 0}
        >
          <ApperIcon name="Zap" size={16} className="mr-2" />
          Auto Map
        </Button>
      </div>
      
      <div className="space-y-4">
        <AnimatePresence>
          {docPlaceholders.map((placeholder) => {
            const mapping = mappings.find(m => m.docPlaceholder === placeholder) || {
              docPlaceholder: placeholder,
              airtableField: '',
              fieldType: 'text',
              isLineItem: false
            }
            
            return (
              <FieldMappingRow
                key={placeholder}
                mapping={mapping}
                airtableFields={airtableFields}
                onUpdate={handleMappingUpdate}
                onRemove={handleMappingRemove}
              />
            )
          })}
        </AnimatePresence>
      </div>
      
      <div className="mt-6 p-4 bg-slate-50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">
            {mappings.filter(m => m.airtableField).length} of {docPlaceholders.length} fields mapped
          </span>
          
          <div className="flex items-center space-x-4">
            <span className="text-slate-500">
              {airtableFields.length} Airtable fields available
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default FieldMappingPanel