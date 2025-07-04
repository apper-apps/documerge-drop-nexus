import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import TemplateList from '@/components/organisms/TemplateList'
import ApperIcon from '@/components/ApperIcon'
import { templateService } from '@/services/api/templateService'

const Templates = () => {
  const navigate = useNavigate()
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  
  const handleCreateNew = () => {
    navigate('/templates/new')
  }
  
  const handleEdit = (template) => {
    navigate(`/templates/${template.Id}/edit`)
  }
  
  const handleDelete = (template) => {
    setSelectedTemplate(template)
    setShowDeleteDialog(true)
  }
  
  const handleGenerate = (template) => {
    navigate('/generate', { state: { templateId: template.Id } })
  }
  
  const confirmDelete = async () => {
    if (!selectedTemplate) return
    
    try {
      await templateService.delete(selectedTemplate.Id)
      toast.success('Template deleted successfully')
      setShowDeleteDialog(false)
      setSelectedTemplate(null)
      // Refresh the list by forcing a re-render
      window.location.reload()
    } catch (error) {
      toast.error('Failed to delete template')
      console.error('Error deleting template:', error)
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Templates</h1>
          <p className="text-slate-600">Manage your document templates</p>
        </div>
        
        <Button
          variant="primary"
          onClick={handleCreateNew}
          className="shadow-lg"
        >
          <ApperIcon name="Plus" size={20} className="mr-2" />
          Create Template
        </Button>
      </div>
      
      {/* Templates List */}
      <TemplateList
        onEdit={handleEdit}
        onDelete={handleDelete}
        onGenerate={handleGenerate}
        onCreateNew={handleCreateNew}
      />
      
      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowDeleteDialog(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <ApperIcon name="Trash2" size={20} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Delete Template</h3>
                <p className="text-sm text-slate-600">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-slate-700 mb-6">
              Are you sure you want to delete "{selectedTemplate?.name}"? This will permanently remove the template and all its configurations.
            </p>
            
            <div className="flex items-center justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={confirmDelete}
              >
                Delete Template
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default Templates