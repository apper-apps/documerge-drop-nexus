import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'

const Settings = () => {
  const [settings, setSettings] = useState({
    defaultImageWidth: 200,
    pdfQuality: 'high',
    enableLogging: true,
    autoSave: true,
    notificationEmail: '',
    timezone: 'UTC'
  })
  
  const [loading, setLoading] = useState(false)
  
  const handleSave = async () => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Settings saved successfully')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }
  
  const handleReset = () => {
    setSettings({
      defaultImageWidth: 200,
      pdfQuality: 'high',
      enableLogging: true,
      autoSave: true,
      notificationEmail: '',
      timezone: 'UTC'
    })
    toast.info('Settings reset to defaults')
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600">Configure your application preferences</p>
      </div>
      
      {/* PDF Generation Settings */}
      <Card>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">PDF Generation</h3>
          <p className="text-slate-600">Configure default settings for PDF generation</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Default Image Width (px)"
            type="number"
            value={settings.defaultImageWidth}
            onChange={(e) => setSettings({...settings, defaultImageWidth: parseInt(e.target.value) || 200})}
            placeholder="200"
          />
          
          <div>
            <label className="form-label">PDF Quality</label>
            <select
              value={settings.pdfQuality}
              onChange={(e) => setSettings({...settings, pdfQuality: e.target.value})}
              className="form-input"
            >
              <option value="low">Low (Faster)</option>
              <option value="medium">Medium</option>
              <option value="high">High (Better Quality)</option>
            </select>
          </div>
        </div>
      </Card>
      
      {/* Application Settings */}
      <Card>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Application</h3>
          <p className="text-slate-600">General application preferences</p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-slate-700">Enable Logging</label>
              <p className="text-sm text-slate-500">Log generation activities for debugging</p>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.enableLogging}
                onChange={(e) => setSettings({...settings, enableLogging: e.target.checked})}
                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-slate-700">Auto Save</label>
              <p className="text-sm text-slate-500">Automatically save template changes</p>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => setSettings({...settings, autoSave: e.target.checked})}
                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
              />
            </div>
          </div>
        </div>
      </Card>
      
      {/* Notifications */}
      <Card>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Notifications</h3>
          <p className="text-slate-600">Configure notification preferences</p>
        </div>
        
        <div className="space-y-4">
          <Input
            label="Notification Email"
            type="email"
            value={settings.notificationEmail}
            onChange={(e) => setSettings({...settings, notificationEmail: e.target.value})}
            placeholder="your@email.com"
          />
          
          <div>
            <label className="form-label">Timezone</label>
            <select
              value={settings.timezone}
              onChange={(e) => setSettings({...settings, timezone: e.target.value})}
              className="form-input"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="Europe/London">London</option>
              <option value="Asia/Tokyo">Tokyo</option>
            </select>
          </div>
        </div>
      </Card>
      
      {/* Security */}
      <Card>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Security</h3>
          <p className="text-slate-600">Manage security and data protection</p>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <ApperIcon name="Shield" size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Data Encryption</h4>
                <p className="text-sm text-blue-700 mt-1">
                  All API keys and sensitive data are encrypted at rest using AES-256 encryption.
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <ApperIcon name="Lock" size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900">Secure Storage</h4>
                <p className="text-sm text-green-700 mt-1">
                  Templates and credentials are stored securely and never exposed in client-side code.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Actions */}
      <div className="flex items-center justify-end space-x-4">
        <Button
          variant="secondary"
          onClick={handleReset}
        >
          <ApperIcon name="RotateCcw" size={20} className="mr-2" />
          Reset to Defaults
        </Button>
        
        <Button
          variant="primary"
          onClick={handleSave}
          loading={loading}
        >
          <ApperIcon name="Save" size={20} className="mr-2" />
          Save Settings
        </Button>
      </div>
    </motion.div>
  )
}

export default Settings