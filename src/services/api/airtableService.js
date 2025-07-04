import airtableData from '@/services/mockData/airtableData.json'

export const airtableService = {
  async testConnection(config) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Simulate connection validation
    if (!config.apiKey || !config.baseId || !config.tableName) {
      throw new Error('Missing required configuration')
    }
    
    // Simulate API key validation
    if (config.apiKey.length < 10) {
      throw new Error('Invalid API key format')
    }
    
    return { success: true }
  },

  async getFields(config) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const table = airtableData.tables.find(t => t.name === config.tableName)
    if (!table) {
      throw new Error(`Table "${config.tableName}" not found`)
    }
    
    return table.fields
  },

  async getRecords(config) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const table = airtableData.tables.find(t => t.name === config.tableName)
    if (!table) {
      throw new Error(`Table "${config.tableName}" not found`)
    }
    
    return table.records
  },

  async getRecord(config, recordId) {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const table = airtableData.tables.find(t => t.name === config.tableName)
    if (!table) {
      throw new Error(`Table "${config.tableName}" not found`)
    }
    
    const record = table.records.find(r => r.id === recordId)
    if (!record) {
      throw new Error('Record not found')
    }
    
    return record
  }
}