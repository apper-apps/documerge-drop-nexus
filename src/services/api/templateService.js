import templateData from '@/services/mockData/templates.json'

// Simple encryption simulation - In production, use proper encryption
const encryptData = (data) => {
  return btoa(JSON.stringify(data)) // Base64 encoding for demo
}

const decryptData = (encryptedData) => {
  try {
    return JSON.parse(atob(encryptedData))
  } catch {
    return null
  }
}

let templates = templateData.map(template => ({
  ...template,
  airtableConfig: template.airtableConfig ? decryptData(template.airtableConfig) : null
}))

export const templateService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return templates.map(template => ({
      ...template,
      airtableConfig: template.airtableConfig ? '***encrypted***' : null
    }))
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const template = templates.find(t => t.Id === id)
    if (!template) {
      throw new Error('Template not found')
    }
    return template
  },

  async create(templateData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const maxId = templates.length > 0 ? Math.max(...templates.map(t => t.Id)) : 0
    const newTemplate = {
      ...templateData,
      Id: maxId + 1,
      airtableConfig: encryptData(templateData.airtableConfig),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    templates.push(newTemplate)
    return newTemplate
  },

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const index = templates.findIndex(t => t.Id === id)
    if (index === -1) {
      throw new Error('Template not found')
    }
    
    templates[index] = {
      ...templates[index],
      ...updateData,
      Id: id,
      airtableConfig: encryptData(updateData.airtableConfig),
      updatedAt: new Date().toISOString()
    }
    
    return templates[index]
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = templates.findIndex(t => t.Id === id)
    if (index === -1) {
      throw new Error('Template not found')
    }
    
    templates.splice(index, 1)
    return true
  }
}