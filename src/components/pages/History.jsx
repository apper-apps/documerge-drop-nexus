import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { generationService } from "@/services/api/generationService";

const History = () => {
  const navigate = useNavigate();
  const [generations, setGenerations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all') // all, completed, failed, pending
  useEffect(() => {
    loadGenerations()
  }, [])
  
  const loadGenerations = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await generationService.getAll()
      setGenerations(data)
    } catch (err) {
      setError('Failed to load generation history')
      console.error('Error loading generations:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'failed':
        return 'danger'
      case 'pending':
        return 'warning'
      default:
        return 'default'
    }
  }
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return 'CheckCircle'
      case 'failed':
        return 'XCircle'
      case 'pending':
        return 'Clock'
      default:
        return 'Circle'
    }
  }
  
  const filteredGenerations = generations.filter(gen => {
    if (filter === 'all') return true
    return gen.status === filter
  })
  
  const handleDownload = (generation) => {
    if (generation.pdfUrl) {
      const link = document.createElement('a')
      link.href = generation.pdfUrl
      link.download = `generated-${generation.Id}.pdf`
      link.click()
    }
  }
  
  if (loading) {
    return (
      <div className="space-y-6">
        <Loading type="shimmer" className="h-16 rounded-lg" />
        <div className="space-y-4">
          {[...Array(8)].map((_, i) => (
            <Loading key={i} type="shimmer" className="h-16 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={loadGenerations} 
        className="min-h-96"
      />
    )
  }
  
  if (generations.length === 0) {
    return (
      <Empty
        title="No generation history"
        description="Start generating PDFs from your templates to see the history here."
        icon="History"
        actionLabel="Generate PDF"
        onAction={() => navigate('/generate')}
      />
    )
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
          <h1 className="text-2xl font-bold text-slate-900">Generation History</h1>
          <p className="text-slate-600">Track your PDF generation activities</p>
        </div>
        
        <Button
          variant="secondary"
          onClick={loadGenerations}
        >
          <ApperIcon name="RefreshCw" size={20} className="mr-2" />
          Refresh
        </Button>
      </div>
      
      {/* Filters */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-slate-700">Filter:</span>
            {['all', 'completed', 'failed', 'pending'].map(status => (
              <Button
                key={status}
                variant={filter === status ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
          
          <div className="text-sm text-slate-500">
            {filteredGenerations.length} of {generations.length} generations
          </div>
        </div>
      </Card>
      
      {/* History List */}
      <Card padding={false}>
        <div className="divide-y divide-slate-200">
          {filteredGenerations.map((generation) => (
            <motion.div
              key={generation.Id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <ApperIcon name="FileText" size={20} className="text-slate-600" />
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-slate-900">
                        PDF Generation
                      </h3>
                      <Badge variant={getStatusColor(generation.status)} size="sm">
                        <ApperIcon name={getStatusIcon(generation.status)} size={12} className="mr-1" />
                        {generation.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-slate-600 mt-1">
                      Template: {generation.templateName || 'Unknown'}
                    </p>
                    
                    <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                      <span>
                        Generated: {format(new Date(generation.createdAt), 'MMM d, yyyy h:mm a')}
                      </span>
                      {generation.recordId && (
                        <span>Record: {generation.recordId}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {generation.status === 'completed' && generation.pdfUrl && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleDownload(generation)}
                    >
                      <ApperIcon name="Download" size={16} className="mr-1" />
                      Download
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                  >
                    <ApperIcon name="MoreHorizontal" size={16} />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
      
      {filteredGenerations.length === 0 && (
        <Empty
          title={`No ${filter === 'all' ? '' : filter} generations found`}
          description="Try adjusting your filter or generate a new PDF document."
          icon="Filter"
        />
      )}
    </motion.div>
  )
}

export default History