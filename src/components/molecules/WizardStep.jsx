import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const WizardStep = ({ 
  step, 
  isActive = false, 
  isCompleted = false, 
  isClickable = false,
  onClick = null,
  className = ''
}) => {
  const handleClick = () => {
    if (isClickable && onClick) {
      onClick(step.id)
    }
  }
  
  const stepClasses = `
    wizard-step 
    ${isActive ? 'active' : ''} 
    ${isCompleted ? 'completed' : ''} 
    ${!isActive && !isCompleted ? 'inactive' : ''} 
    ${isClickable ? 'clickable' : ''}
    ${className}
  `
  
  return (
    <motion.div
      className="flex flex-col items-center"
      whileHover={isClickable ? { scale: 1.05 } : {}}
      whileTap={isClickable ? { scale: 0.95 } : {}}
    >
      <div className={stepClasses} onClick={handleClick}>
        {isCompleted ? (
          <ApperIcon name="Check" size={20} />
        ) : (
          <span>{step.number}</span>
        )}
      </div>
      
      <div className="mt-2 text-center">
        <p className={`text-sm font-medium ${isActive ? 'text-primary-600' : isCompleted ? 'text-emerald-600' : 'text-slate-500'}`}>
          {step.title}
        </p>
        <p className="text-xs text-slate-400 mt-1 max-w-20">
          {step.description}
        </p>
      </div>
    </motion.div>
  )
}

export default WizardStep