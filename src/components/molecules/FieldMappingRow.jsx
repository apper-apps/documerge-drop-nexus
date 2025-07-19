import { motion } from "framer-motion";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import React from "react";
const FieldMappingRow = ({ 
  mapping, 
  airtableFields = [], 
  onUpdate, 
  onRemove,
  className = '' 
}) => {
  const { docPlaceholder, airtableField, fieldType, isLineItem } = mapping
  
  const handleFieldChange = (value) => {
    const selectedField = airtableFields.find(field => field.name === value)
    onUpdate({
      ...mapping,
      airtableField: value,
      fieldType: selectedField?.type || 'text'
    })
  }
  
const getFieldTypeIcon = (type) => {
    switch (type) {
      case 'multipleAttachments':
        return 'Image'
      case 'number':
        return 'Hash'
      case 'date':
      case 'dateTime':
        return 'Calendar'
      case 'email':
        return 'Mail'
      case 'url':
        return 'Link'
      case 'multipleRecordLinks':
        return 'Link2'
      case 'formula':
        return 'Calculator'
      case 'lookup':
        return 'Search'
      case 'rollup':
        return 'TrendingUp'
      case 'count':
        return 'Hash'
      case 'rating':
        return 'Star'
      case 'checkbox':
        return 'CheckSquare'
      case 'multilineText':
        return 'AlignLeft'
      case 'multipleSelect':
        return 'Tags'
      case 'currency':
        return 'DollarSign'
      case 'percent':
        return 'Percent'
      case 'phoneNumber':
        return 'Phone'
      default:
        return 'Type'
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`flex items-center space-x-4 p-4 bg-white rounded-lg border border-slate-200 ${className}`}
    >
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-2">
          <ApperIcon name="Braces" size={16} className="text-slate-400" />
          <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded">
            {docPlaceholder}
          </span>
          
          {isLineItem && (
            <Badge variant="info" size="sm">
              <ApperIcon name="List" size={12} className="mr-1" />
              Line Item
            </Badge>
          )}
        </div>
        
        <Select
          placeholder="Select Airtable field"
          value={airtableField}
          onChange={(e) => handleFieldChange(e.target.value)}
        >
          {airtableFields.map((field) => (
            <option key={field.name} value={field.name}>
              {field.name} ({field.type})
            </option>
          ))}
        </Select>
      </div>
      
      <div className="flex items-center space-x-2">
        <ApperIcon name="ArrowRight" size={16} className="text-slate-400" />
      </div>
      
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-2">
          <ApperIcon name={getFieldTypeIcon(fieldType)} size={16} className="text-slate-400" />
          <span className="text-sm text-slate-600 capitalize">
            {fieldType?.replace(/([A-Z])/g, ' $1').trim() || 'Text'}
          </span>
        </div>
        
        <div className="h-10 bg-slate-50 rounded-lg flex items-center px-3 text-sm text-slate-600">
          {airtableField || 'No field selected'}
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(mapping)}
        className="text-slate-400 hover:text-red-500"
      >
        <ApperIcon name="X" size={16} />
      </Button>
    </motion.div>
  )
}

export default FieldMappingRow