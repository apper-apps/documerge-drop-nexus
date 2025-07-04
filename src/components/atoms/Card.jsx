import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  className = '', 
  hover = false,
  padding = true,
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-lg shadow-sm border border-slate-200'
  const hoverClasses = hover ? 'card-hover cursor-pointer' : ''
  const paddingClasses = padding ? 'p-6' : ''
  
  const classes = `${baseClasses} ${hoverClasses} ${paddingClasses} ${className}`
  
  return (
    <motion.div
      className={classes}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card