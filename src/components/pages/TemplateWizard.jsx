import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Card from "@/components/atoms/Card";
import WizardStepper from "@/components/organisms/WizardStepper";
import FieldMappingPanel from "@/components/organisms/FieldMappingPanel";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { templateService } from "@/services/api/templateService";
import { airtableService } from "@/services/api/airtableService";

const TemplateWizard = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)
  
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Form data
  const [templateData, setTemplateData] = useState({
    name: '',
    description: '',
    airtableConfig: {
      apiKey: '',
      baseId: '',
      tableName: ''
    },
    googleDocUrl: '',
    fieldMappings: [],
    settings: {
      imageWidth: 200,
      enableLineItems: false
    }
  })
  
  // Validation states
  const [errors, setErrors] = useState({})
  const [testConnection, setTestConnection] = useState(false)
  
  useEffect(() => {
    if (isEdit) {
      loadTemplate()
    }
  }, [id, isEdit])
  
  const loadTemplate = async () => {
    try {
      setLoading(true)
      const template = await templateService.getById(parseInt(id))
      setTemplateData(template)
      
      // Mark steps as completed based on available data
      const completed = [1] // Always mark step 1 as completed for existing templates
      if (template.googleDocUrl) completed.push(2)
      if (template.fieldMappings && template.fieldMappings.length > 0) completed.push(3)
      setCompletedSteps(completed)
    } catch (err) {
      setError('Failed to load template')
      console.error('Error loading template:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const handleStepClick = (stepId) => {
    if (completedSteps.includes(stepId) || stepId === currentStep) {
      setCurrentStep(stepId)
    }
  }
  
  const validateStep = (step) => {
    const newErrors = {}
    
    switch (step) {
      case 1:
        if (!templateData.airtableConfig.apiKey) newErrors.apiKey = 'API Key is required'
        if (!templateData.airtableConfig.baseId) newErrors.baseId = 'Base ID is required'
        if (!templateData.airtableConfig.tableName) newErrors.tableName = 'Table Name is required'
        break
      case 2:
        if (!templateData.googleDocUrl) newErrors.googleDocUrl = 'Google Docs URL is required'
        break
      case 3:
        if (templateData.fieldMappings.length === 0) newErrors.fieldMappings = 'At least one field mapping is required'
        break
      case 4:
        if (!templateData.name) newErrors.name = 'Template name is required'
        break
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleNext = async () => {
    if (!validateStep(currentStep)) return
    
    // Test connection for step 1
    if (currentStep === 1 && !testConnection) {
      try {
        setTestConnection(true)
        await airtableService.testConnection(templateData.airtableConfig)
        toast.success('Airtable connection successful')
      } catch (err) {
        toast.error('Failed to connect to Airtable')
        setTestConnection(false)
        return
      } finally {
        setTestConnection(false)
      }
    }
    
    // Mark current step as completed
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep])
    }
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }
  
  const handleSave = async () => {
    if (!validateStep(4)) return
    
    try {
      setLoading(true)
      
      if (isEdit) {
        await templateService.update(parseInt(id), templateData)
        toast.success('Template updated successfully')
      } else {
        await templateService.create(templateData)
        toast.success('Template created successfully')
      }
      
      navigate('/templates')
    } catch (err) {
      toast.error('Failed to save template')
      console.error('Error saving template:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const handleCancel = () => {
    navigate('/templates')
  }
  
  const updateTemplateData = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setTemplateData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setTemplateData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }
  
  if (loading && isEdit) {
    return (
      <div className="space-y-8">
        <Loading type="shimmer" className="h-16 rounded-lg" />
        <Loading type="shimmer" className="h-96 rounded-lg" />
      </div>
    )
  }
  
  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={loadTemplate} 
        className="min-h-96"
      />
    )
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isEdit ? 'Edit Template' : 'Create Template'}
          </h1>
          <p className="text-slate-600">
            {isEdit ? 'Update your document template' : 'Set up a new document template'}
          </p>
        </div>
        
        <Button
          variant="ghost"
          onClick={handleCancel}
        >
          <ApperIcon name="X" size={20} className="mr-2" />
          Cancel
        </Button>
      </div>
      
      {/* Wizard Stepper */}
      <WizardStepper
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={handleStepClick}
      />
      
      {/* Step Content */}
      <div className="min-h-[32rem]">
        {currentStep === 1 && (
          <Card>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Connect to Airtable</h3>
              <p className="text-slate-600">
                Enter your Airtable credentials to connect to your data source.
              </p>
            </div>
            
            <div className="space-y-4">
              <Input
                label="API Key"
                type="password"
                value={templateData.airtableConfig.apiKey}
                onChange={(e) => updateTemplateData('airtableConfig.apiKey', e.target.value)}
                placeholder="Enter your Airtable API key"
                error={errors.apiKey}
                required
              />
              
              <Input
                label="Base ID"
                value={templateData.airtableConfig.baseId}
                onChange={(e) => updateTemplateData('airtableConfig.baseId', e.target.value)}
                placeholder="Enter your Airtable base ID"
                error={errors.baseId}
                required
              />
              
              <Input
                label="Table Name"
                value={templateData.airtableConfig.tableName}
                onChange={(e) => updateTemplateData('airtableConfig.tableName', e.target.value)}
                placeholder="Enter your Airtable table name"
                error={errors.tableName}
                required
              />
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <ApperIcon name="Info" size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">How to find your credentials</h4>
                    <ul className="text-sm text-blue-700 mt-1 space-y-1">
                      <li>• API Key: Go to your Airtable account settings</li>
                      <li>• Base ID: Found in your Airtable base URL</li>
                      <li>• Table Name: The name of your table in Airtable</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}
        
        {currentStep === 2 && (
          <Card>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Google Docs Template</h3>
              <p className="text-slate-600">
                Provide the URL to your Google Docs template with placeholders.
              </p>
            </div>
            
            <div className="space-y-4">
              <Input
                label="Google Docs URL"
                value={templateData.googleDocUrl}
                onChange={(e) => updateTemplateData('googleDocUrl', e.target.value)}
                placeholder="https://docs.google.com/document/d/your-doc-id/edit"
                error={errors.googleDocUrl}
                required
              />
              
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <ApperIcon name="FileText" size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
<div>
                    <h4 className="font-medium text-green-900">Template Setup</h4>
                    <ul className="text-sm text-green-700 mt-1 space-y-1">
                      <li>• Use placeholders like {`{{customer_name}}`} in your document</li>
                      <li>• Make sure the document is shared with view access</li>
                      <li>• Placeholders will be replaced with Airtable data</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}
        
        {currentStep === 3 && (
          <FieldMappingPanel
            airtableConfig={templateData.airtableConfig}
            googleDocUrl={templateData.googleDocUrl}
            mappings={templateData.fieldMappings}
            onMappingsChange={(mappings) => updateTemplateData('fieldMappings', mappings)}
          />
        )}
        
        {currentStep === 4 && (
          <Card>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Save Template</h3>
              <p className="text-slate-600">
                Give your template a name and configure final settings.
              </p>
            </div>
            
            <div className="space-y-4">
              <Input
                label="Template Name"
                value={templateData.name}
                onChange={(e) => updateTemplateData('name', e.target.value)}
                placeholder="Enter template name"
                error={errors.name}
                required
              />
              
              <Textarea
                label="Description"
                value={templateData.description}
                onChange={(e) => updateTemplateData('description', e.target.value)}
                placeholder="Optional description"
                rows={3}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Image Width (px)"
                  type="number"
                  value={templateData.settings.imageWidth}
                  onChange={(e) => updateTemplateData('settings.imageWidth', parseInt(e.target.value) || 200)}
                  placeholder="200"
                />
                
                <div className="flex items-center space-x-2 pt-8">
                  <input
                    type="checkbox"
                    id="enableLineItems"
                    checked={templateData.settings.enableLineItems}
                    onChange={(e) => updateTemplateData('settings.enableLineItems', e.target.checked)}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="enableLineItems" className="text-sm font-medium text-slate-700">
                    Enable line items support
                  </label>
                </div>
              </div>
              
              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-2">Template Summary</h4>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Airtable Table:</span>
                    <span className="font-mono">{templateData.airtableConfig.tableName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Field Mappings:</span>
                    <span>{templateData.fieldMappings.length} mappings</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Google Docs:</span>
                    <span>{templateData.googleDocUrl ? 'Connected' : 'Not connected'}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
      
      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200">
        <Button
          variant="secondary"
          onClick={handleBack}
          disabled={currentStep === 1}
        >
          <ApperIcon name="ChevronLeft" size={20} className="mr-2" />
          Back
        </Button>
        
        <div className="flex items-center space-x-3">
          {currentStep < 4 ? (
            <Button
              variant="primary"
              onClick={handleNext}
              loading={testConnection}
            >
              Next
              <ApperIcon name="ChevronRight" size={20} className="ml-2" />
            </Button>
          ) : (
            <Button
              variant="success"
              onClick={handleSave}
              loading={loading}
            >
              <ApperIcon name="Save" size={20} className="mr-2" />
              {isEdit ? 'Update Template' : 'Save Template'}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default TemplateWizard