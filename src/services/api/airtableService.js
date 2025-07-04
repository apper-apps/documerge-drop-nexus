import airtableData from "@/services/mockData/airtableData.json";
import React from "react";
import Error from "@/components/ui/Error";
const airtableService = {
  async testConnection(config) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Simulate connection validation
    if (!config?.apiKey || !config?.baseId || !config?.tableName) {
      throw new Error('Missing required configuration')
    }
    
    // Simulate API key validation
    if (config.apiKey.length < 10) {
      throw new Error('Invalid API key format')
    }
    
    return { success: true }
  },

  async getFields(config) {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Validate configuration
    if (!config?.apiKey || !config?.baseId || !config?.tableName) {
      throw new Error('Missing required Airtable configuration')
    }
    
    // Simulate API key validation
    if (config.apiKey.length < 10) {
      throw new Error('Invalid API key format')
    }
    
    // Simulate table not found error
    if (config.tableName && !airtableData.tables.find(t => t.name === config.tableName)) {
      throw new Error(`Table "${config.tableName}" not found`)
    }
    
    // Find the table or use the first one
    const table = airtableData.tables.find(t => t.name === config.tableName) || airtableData.tables[0]
    
    if (!table?.fields) {
      throw new Error('No fields found in table')
    }
    
    // Return fields with proper structure
    return table.fields.map(field => ({
      id: field.id || field.name.toLowerCase().replace(/\s+/g, '_'),
      name: field.name,
      type: field.type || 'text',
      description: field.description || '',
      options: field.options || null
    }))
  },

  async getRecords(config, options = {}) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Validate configuration
    if (!config?.apiKey || !config?.baseId || !config?.tableName) {
      throw new Error('Missing required Airtable configuration')
    }
    
    // Find the table
    const table = airtableData.tables.find(t => t.name === config.tableName) || airtableData.tables[0]
    
    if (!table?.records) {
      throw new Error('No records found in table')
    }
    
    // Apply basic filtering and limiting
    let records = table.records
    
    if (options.maxRecords) {
      records = records.slice(0, options.maxRecords)
    }
    
return records.map(record => ({
      id: record.id,
      fields: record.fields,
      createdTime: record.createdTime || new Date().toISOString()
    }))
  },
  async getRecord(config, recordId) {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // Validate configuration
    if (!config?.apiKey || !config?.baseId || !config?.tableName) {
      throw new Error('Missing required Airtable configuration')
    }
    
    const table = airtableData.tables.find(t => t.name === config.tableName)
    if (!table) {
      throw new Error(`Table "${config.tableName}" not found`)
    }
    
    const record = table.records.find(r => r.id === recordId)
    if (!record) {
      throw new Error('Record not found')
    }
    
return {
      id: record.id,
      fields: record.fields,
      createdTime: record.createdTime || new Date().toISOString()
    }
  }
}

export { airtableService };