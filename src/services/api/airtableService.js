import airtableData from "@/services/mockData/airtableData.json";
const airtableService = {
  async getFields(config) {
    try {
      if (!config?.baseId || !config?.tableName) {
        throw new Error('Missing required Airtable configuration')
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      const table = airtableData.tables.find(t => t.name === config.tableName)
      if (!table) {
        throw new Error(`Table "${config.tableName}" not found`)
      }

      return table.fields
    } catch (error) {
      console.error('Airtable service error:', error)
      throw error
    }
  },

  async getRecords(config) {
    try {
      if (!config?.baseId || !config?.tableName) {
        throw new Error('Missing required Airtable configuration')
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      const table = airtableData.tables.find(t => t.name === config.tableName)
      if (!table) {
        throw new Error(`Table "${config.tableName}" not found`)
      }

      return table.records
    } catch (error) {
      console.error('Airtable service error:', error)
      throw error
    }
  },

  async validateConnection(config) {
    try {
      if (!config?.apiKey || !config?.baseId) {
        throw new Error('Missing API key or base ID')
      }

      // Simulate API validation
      await new Promise(resolve => setTimeout(resolve, 500))
      
      return { valid: true, message: 'Connection successful' }
    } catch (error) {
      console.error('Airtable validation error:', error)
      throw error
    }
  }
}

export default airtableService