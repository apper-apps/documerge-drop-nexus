import { useState, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { AuthContext } from '@/App'

const Header = ({ onMenuClick }) => {
  const location = useLocation()
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard'
      case '/templates':
        return 'Templates'
      case '/templates/new':
        return 'Create Template'
      case '/generate':
        return 'Generate PDF'
      case '/history':
        return 'Generation History'
      case '/settings':
        return 'Settings'
      default:
        return 'DocuMerge Pro'
    }
  }
  
  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean)
    const breadcrumbs = [{ name: 'Home', path: '/' }]
    
    paths.forEach((path, index) => {
      const fullPath = '/' + paths.slice(0, index + 1).join('/')
      let name = path.charAt(0).toUpperCase() + path.slice(1)
      
      if (path === 'new') name = 'Create Template'
      
      breadcrumbs.push({ name, path: fullPath })
    })
    
    return breadcrumbs
  }
  
  return (
    <header className="bg-white border-b border-slate-200 lg:pl-64">
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" size={20} />
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{getPageTitle()}</h1>
            
            <nav className="flex items-center space-x-2 text-sm text-slate-500 mt-1">
              {getBreadcrumbs().map((crumb, index) => (
                <div key={crumb.path} className="flex items-center">
                  {index > 0 && <ApperIcon name="ChevronRight" size={16} className="mx-1" />}
                  <span className={index === getBreadcrumbs().length - 1 ? 'text-slate-900 font-medium' : 'hover:text-slate-700'}>
                    {crumb.name}
                  </span>
                </div>
              ))}
            </nav>
          </div>
        </div>
        
<div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <ApperIcon name="Bell" size={20} />
          </Button>
          
          <Button variant="ghost" size="sm">
            <ApperIcon name="HelpCircle" size={20} />
          </Button>
          
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);
  
  return (
    <Button 
      variant="ghost" 
      size="sm"
      onClick={logout}
      className="text-slate-600 hover:text-slate-900"
    >
      <ApperIcon name="LogOut" size={20} />
    </Button>
  );
};
export default Header