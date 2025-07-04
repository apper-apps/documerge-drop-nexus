import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ 
  message = "Something went wrong", 
  onRetry = null, 
  className = '',
  type = 'default'
}) => {
  const getIcon = () => {
    switch (type) {
      case 'network':
        return 'WifiOff'
      case 'notFound':
        return 'Search'
      case 'permission':
        return 'Lock'
      default:
        return 'AlertTriangle'
    }
  }

  const getTitle = () => {
    switch (type) {
      case 'network':
        return 'Connection Error'
      case 'notFound':
        return 'Not Found'
      case 'permission':
        return 'Access Denied'
      default:
        return 'Error'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
    >
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name={getIcon()} size={32} className="text-red-600" />
      </div>
      
      <h3 className="text-lg font-semibold text-slate-900 mb-2">
        {getTitle()}
      </h3>
      
      <p className="text-slate-600 mb-6 max-w-md">
        {message}
      </p>
      
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="primary"
          className="min-w-24"
        >
          <ApperIcon name="RefreshCw" size={16} className="mr-2" />
          Try Again
        </Button>
      )}
    </motion.div>
  )
}

export default Error