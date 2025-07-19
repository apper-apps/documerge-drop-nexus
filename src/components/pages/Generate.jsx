import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { templateService } from "@/services/api/templateService";
import { airtableService } from "@/services/api/airtableService";
import { pdfService } from "@/services/api/pdfService";

const Generate = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const preselectedTemplateId = location.state?.templateId
  
  const [templates, setTemplates] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [records, setRecords] = useState([])
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingRecords, setLoadingRecords] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [recordsError, setRecordsError] = useState('')
  
  useEffect(() => {
    loadTemplates()
  }, [])
  
  useEffect(() => {
    if (preselectedTemplateId) {
      const template = templates.find(t => t.Id === preselectedTemplateId)
      if (template) {
        setSelectedTemplate(template)
        loadRecords(template)
      }
    }
  }, [templates, preselectedTemplateId])
  
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
  
const loadRecords = async (template) => {
    try {
      setLoadingRecords(true)
      setRecordsError('')
      
      // Validate airtableService is available
      if (!airtableService?.getRecords) {
        throw new Error('Airtable service not available')
      }
      
      // Validate template configuration
      if (!template?.airtableConfig?.tableName) {
        throw new Error('Invalid template configuration - missing table name')
      }
      
      const data = await airtableService.getRecords(template.airtableConfig)
      setRecords(Array.isArray(data) ? data : [])
    } catch (err) {
      const errorMessage = err.message || 'Failed to load records from Airtable'
      setRecordsError(errorMessage)
      console.error('Error loading records:', err)
      setRecords([])
    } finally {
      setLoadingRecords(false)
    }
  }
  
  const handleTemplateChange = (templateId) => {
    const template = templates.find(t => t.Id === parseInt(templateId))
    setSelectedTemplate(template)
    setSelectedRecord(null)
    setRecords([])
    
    if (template) {
      loadRecords(template)
    }
  }
  
  const handleRecordChange = (recordId) => {
    const record = records.find(r => r.id === recordId)
    setSelectedRecord(record)
  }
  
  const handleGenerate = async () => {
    if (!selectedTemplate || !selectedRecord) {
      toast.error('Please select both template and record')
      return
    }
    
    try {
      setGenerating(true)
      
      const result = await pdfService.generate({
        template: selectedTemplate,
        record: selectedRecord
      })
      
      // Create download link
      const link = document.createElement('a')
      link.href = result.downloadUrl
      link.download = result.filename
      link.click()
      
      toast.success('PDF generated successfully')
    } catch (err) {
      toast.error('Failed to generate PDF')
      console.error('Error generating PDF:', err)
    } finally {
      setGenerating(false)
    }
  }
  
  if (loading) {
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
        onRetry={loadTemplates} 
        className="min-h-96"
      />
    )
  }
  
  if (templates.length === 0) {
    return (
      <Empty
        title="No templates available"
        description="Create a template first to generate PDFs from your Airtable data."
        icon="FileText"
        actionLabel="Create Template"
        onAction={() => navigate('/templates/new')}
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
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Generate PDF</h1>
        <p className="text-slate-600">Select a template and record to generate a PDF document</p>
      </div>
      
      {/* Selection */}
      <Card>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Select Template</h3>
            <Select
              value={selectedTemplate?.Id || ''}
              onChange={(e) => handleTemplateChange(e.target.value)}
              placeholder="Choose a template"
            >
              {templates.map(template => (
                <option key={template.Id} value={template.Id}>
                  {template.name}
                </option>
              ))}
            </Select>
            
            {selectedTemplate && (
              <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <ApperIcon name="FileText" size={16} className="text-slate-600" />
                  <span className="font-medium text-slate-900">{selectedTemplate.name}</span>
                </div>
                <p className="text-sm text-slate-600">
                  {selectedTemplate.fieldMappings?.length || 0} field mappings configured
                </p>
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Select Record</h3>
            
            {!selectedTemplate ? (
              <div className="p-6 bg-slate-50 rounded-lg text-center">
                <ApperIcon name="ArrowLeft" size={24} className="mx-auto text-slate-400 mb-2" />
                <p className="text-slate-500">Select a template first</p>
              </div>
            ) : loadingRecords ? (
              <Loading type="spinner" className="h-20" />
            ) : recordsError ? (
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <ApperIcon name="AlertCircle" size={16} className="text-red-600" />
                  <span className="font-medium text-red-900">Error loading records</span>
                </div>
                <p className="text-sm text-red-700">{recordsError}</p>
              </div>
            ) : records.length === 0 ? (
              <div className="p-6 bg-slate-50 rounded-lg text-center">
                <ApperIcon name="Database" size={24} className="mx-auto text-slate-400 mb-2" />
                <p className="text-slate-500">No records found in Airtable</p>
              </div>
            ) : (
              <>
                <Select
                  value={selectedRecord?.id || ''}
                  onChange={(e) => handleRecordChange(e.target.value)}
                  placeholder="Choose a record"
                >
                  {records.map(record => (
                    <option key={record.id} value={record.id}>
                      {record.fields.Name || record.fields.Title || record.id}
                    </option>
                  ))}
                </Select>
                
                {selectedRecord && (
                  <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <ApperIcon name="Database" size={16} className="text-slate-600" />
                      <span className="font-medium text-slate-900">
                        {selectedRecord.fields.Name || selectedRecord.fields.Title || 'Record'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">
                      {Object.keys(selectedRecord.fields).length} fields available
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Card>
      
      {/* Preview */}
      {selectedTemplate && selectedRecord && (
        <Card>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Preview</h3>
          
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="FileText" size={20} className="text-primary-600" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">{selectedTemplate.name}</h4>
                  <p className="text-sm text-slate-500">
                    Record: {selectedRecord.fields.Name || selectedRecord.fields.Title || selectedRecord.id}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <ApperIcon name="Database" size={16} className="text-slate-400" />
                <span className="text-sm text-slate-600">
                  {selectedTemplate.airtableConfig.tableName}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium text-slate-900 mb-2">Field Mappings</h5>
                <div className="space-y-1">
                  {selectedTemplate.fieldMappings?.slice(0, 3).map((mapping, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <ApperIcon name="ArrowRight" size={14} className="text-slate-400" />
                      <span className="text-slate-600">
                        {mapping.docPlaceholder} → {mapping.airtableField}
                      </span>
                    </div>
                  ))}
                  {selectedTemplate.fieldMappings?.length > 3 && (
                    <div className="text-slate-500">
                      +{selectedTemplate.fieldMappings.length - 3} more mappings
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h5 className="font-medium text-slate-900 mb-2">Record Data</h5>
                <div className="space-y-1">
                  {Object.entries(selectedRecord.fields).slice(0, 3).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <ApperIcon name="Database" size={14} className="text-slate-400" />
                      <span className="text-slate-600 truncate">
                        {key}: {typeof value === 'string' ? value : JSON.stringify(value)}
                      </span>
                    </div>
                  ))}
                  {Object.keys(selectedRecord.fields).length > 3 && (
                    <div className="text-slate-500">
                      +{Object.keys(selectedRecord.fields).length - 3} more fields
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
      
      {/* Actions */}
      <div className="flex items-center justify-end space-x-4">
        <Button
          variant="secondary"
          onClick={() => window.history.back()}
        >
          <ApperIcon name="ArrowLeft" size={20} className="mr-2" />
          Back
        </Button>
        
        <Button
          variant="primary"
          onClick={handleGenerate}
          disabled={!selectedTemplate || !selectedRecord}
          loading={generating}
          size="lg"
        >
          <ApperIcon name="Download" size={20} className="mr-2" />
          Generate PDF
        </Button>
      </div>
    </motion.div>
  )
}

export default Generate