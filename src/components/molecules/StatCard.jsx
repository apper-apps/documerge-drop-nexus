import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend = null, 
  color = 'blue',
  className = '' 
}) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-emerald-100 text-emerald-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600'
  }
  
  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          
          {trend && (
            <div className="flex items-center mt-2">
              <ApperIcon 
                name={trend.direction === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                size={16} 
                className={`mr-1 ${trend.direction === 'up' ? 'text-emerald-500' : 'text-red-500'}`} 
              />
              <span className={`text-sm font-medium ${trend.direction === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                {trend.value}
              </span>
              <span className="text-slate-500 text-sm ml-1">from last month</span>
            </div>
          )}
        </div>
        
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <ApperIcon name={icon} size={24} />
        </div>
      </div>
      
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-slate-50 rounded-full transform translate-x-16 -translate-y-16 opacity-30" />
    </Card>
  )
}

export default StatCard