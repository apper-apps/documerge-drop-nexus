import { motion } from 'framer-motion'
import { format } from 'date-fns'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'

const TemplateCard = ({ 
  template, 
  onEdit, 
  onDelete, 
  onGenerate,
  className = '' 
}) => {
  const { name, updatedAt, fieldMappings = [], googleDocUrl } = template
  
  const mappingCount = fieldMappings.length
  const hasGoogleDoc = Boolean(googleDocUrl)
  
  return (
    <Card hover className={`group ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
            <ApperIcon name="FileText" size={20} className="text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">
              {name}
            </h3>
            <p className="text-sm text-slate-500">
              Updated {format(new Date(updatedAt), 'MMM d, yyyy')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {hasGoogleDoc && (
            <Badge variant="success" size="sm">
              <ApperIcon name="Link" size={12} className="mr-1" />
              Connected
            </Badge>
          )}
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-slate-600">
          <ApperIcon name="Mapping" size={16} className="mr-2" />
          <span>{mappingCount} field mappings</span>
        </div>
        
        {hasGoogleDoc && (
          <div className="flex items-center text-sm text-slate-600">
            <ApperIcon name="ExternalLink" size={16} className="mr-2" />
            <span className="truncate">Google Docs template</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(template)}
            className="text-slate-600 hover:text-primary-600"
          >
            <ApperIcon name="Edit2" size={16} className="mr-1" />
            Edit
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(template)}
            className="text-slate-600 hover:text-red-600"
          >
            <ApperIcon name="Trash2" size={16} className="mr-1" />
            Delete
          </Button>
        </div>
        
        <Button
          variant="primary"
          size="sm"
          onClick={() => onGenerate(template)}
          disabled={!hasGoogleDoc || mappingCount === 0}
        >
          <ApperIcon name="Download" size={16} className="mr-1" />
          Generate
        </Button>
      </div>
    </Card>
  )
}

export default TemplateCard