import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import StatCard from '@/components/molecules/StatCard'
import TemplateCard from '@/components/molecules/TemplateCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { templateService } from '@/services/api/templateService'
import { generationService } from '@/services/api/generationService'

const Dashboard = () => {
  const navigate = useNavigate()
  const [templates, setTemplates] = useState([])
  const [recentGenerations, setRecentGenerations] = useState([])
  const [stats, setStats] = useState({
    totalTemplates: 0,
    totalGenerations: 0,
    thisMonth: 0,
    successRate: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  useEffect(() => {
    loadDashboardData()
  }, [])
  
  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [templatesData, generationsData] = await Promise.all([
        templateService.getAll(),
        generationService.getAll()
      ])
      
      setTemplates(templatesData.slice(0, 6)) // Show recent 6 templates
      setRecentGenerations(generationsData.slice(0, 5)) // Show recent 5 generations
      
      // Calculate stats
      const thisMonth = generationsData.filter(gen => {
        const genDate = new Date(gen.createdAt)
        const now = new Date()
        return genDate.getMonth() === now.getMonth() && genDate.getFullYear() === now.getFullYear()
      }).length
      
      const successfulGenerations = generationsData.filter(gen => gen.status === 'completed').length
      const successRate = generationsData.length > 0 ? (successfulGenerations / generationsData.length) * 100 : 0
      
      setStats({
        totalTemplates: templatesData.length,
        totalGenerations: generationsData.length,
        thisMonth,
        successRate: Math.round(successRate)
      })
    } catch (err) {
      setError('Failed to load dashboard data')
      console.error('Error loading dashboard:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const handleCreateTemplate = () => {
    navigate('/templates/new')
  }
  
  const handleViewTemplates = () => {
    navigate('/templates')
  }
  
  const handleGeneratePDF = () => {
    navigate('/generate')
  }
  
  const handleViewHistory = () => {
    navigate('/history')
  }
  
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Loading key={i} type="shimmer" className="h-32 rounded-lg" />
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Loading type="shimmer" className="h-96 rounded-lg" />
          <Loading type="shimmer" className="h-96 rounded-lg" />
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={loadDashboardData} 
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
      {/* Quick Actions */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
            <p className="text-sm text-slate-600">Get started with document generation</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="primary"
            size="lg"
            onClick={handleCreateTemplate}
            className="h-16 flex-col"
          >
            <ApperIcon name="Plus" size={24} className="mb-1" />
            Create Template
          </Button>
          
          <Button
            variant="secondary"
            size="lg"
            onClick={handleGeneratePDF}
            className="h-16 flex-col"
          >
            <ApperIcon name="Download" size={24} className="mb-1" />
            Generate PDF
          </Button>
          
          <Button
            variant="secondary"
            size="lg"
            onClick={handleViewHistory}
            className="h-16 flex-col"
          >
            <ApperIcon name="History" size={24} className="mb-1" />
            View History
          </Button>
        </div>
      </Card>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Templates"
          value={stats.totalTemplates}
          icon="FileText"
          color="blue"
        />
        
        <StatCard
          title="Total Generations"
          value={stats.totalGenerations}
          icon="Download"
          color="green"
        />
        
        <StatCard
          title="This Month"
          value={stats.thisMonth}
          icon="Calendar"
          color="purple"
        />
        
        <StatCard
          title="Success Rate"
          value={`${stats.successRate}%`}
          icon="TrendingUp"
          color="green"
        />
      </div>
      
      {/* Recent Templates and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Templates */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Recent Templates</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleViewTemplates}
            >
              View All
              <ApperIcon name="ArrowRight" size={16} className="ml-1" />
            </Button>
          </div>
          
          <div className="space-y-4">
            {templates.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="FileText" size={48} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500 mb-4">No templates yet</p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleCreateTemplate}
                >
                  Create First Template
                </Button>
              </div>
            ) : (
              templates.map((template) => (
                <div key={template.Id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-900">{template.name}</h4>
                      <p className="text-sm text-slate-500">
                        {template.fieldMappings?.length || 0} field mappings
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/templates/${template.Id}/edit`)}
                      >
                        <ApperIcon name="Edit2" size={16} />
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate('/generate', { state: { templateId: template.Id } })}
                      >
                        Generate
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
        
        {/* Recent Activity */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleViewHistory}
            >
              View All
              <ApperIcon name="ArrowRight" size={16} className="ml-1" />
            </Button>
          </div>
          
          <div className="space-y-4">
            {recentGenerations.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Activity" size={48} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500 mb-4">No activity yet</p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleGeneratePDF}
                >
                  Generate First PDF
                </Button>
              </div>
            ) : (
              recentGenerations.map((generation) => (
                <div key={generation.Id} className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${generation.status === 'completed' ? 'bg-emerald-500' : generation.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">
                      PDF Generated
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(generation.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-medium ${generation.status === 'completed' ? 'text-emerald-600' : generation.status === 'failed' ? 'text-red-600' : 'text-yellow-600'}`}>
                      {generation.status}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </motion.div>
  )
}

export default Dashboard