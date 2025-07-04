import { motion } from 'framer-motion'

const Loading = ({ type = 'skeleton', className = '' }) => {
  if (type === 'skeleton') {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="space-y-4">
          <div className="h-4 bg-slate-300 rounded w-3/4"></div>
          <div className="h-4 bg-slate-300 rounded w-1/2"></div>
          <div className="h-4 bg-slate-300 rounded w-5/6"></div>
        </div>
      </div>
    )
  }

  if (type === 'spinner') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <motion.div
          className="w-8 h-8 border-4 border-primary-200 rounded-full border-t-primary-600"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    )
  }

  if (type === 'shimmer') {
    return (
      <div className={`shimmer rounded-lg ${className}`}>
        <div className="h-full w-full bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200"></div>
      </div>
    )
  }

  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        <motion.div
          className="w-12 h-12 border-4 border-primary-200 rounded-full border-t-primary-600"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-slate-600 text-sm">Loading...</p>
      </div>
    </div>
  )
}

export default Loading