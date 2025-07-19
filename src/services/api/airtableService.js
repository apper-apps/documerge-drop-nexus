import airtableData from "@/services/mockData/airtableData.json";
const airtableService = {
  // Test connection to Airtable
  async testConnection(config) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!config?.apiKey || !config?.baseId || !config?.tableName) {
        throw new Error('Missing required configuration: API key, base ID, or table name');
      }
      
      // Validate table exists in mock data
      const table = airtableData.tables.find(t => t.name === config.tableName);
      if (!table) {
        throw new Error(`Table "${config.tableName}" not found`);
      }
      
      return {
        success: true,
        message: 'Connection successful',
        tableInfo: {
          name: table.name,
          fieldCount: table.fields.length,
          recordCount: table.records.length
        }
      };
    } catch (error) {
      console.error('Airtable connection test failed:', error);
      throw new Error(error.message || 'Failed to connect to Airtable');
    }
  },

  // Get records from a table
  async getRecords(config) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (!config?.tableName) {
        throw new Error('Table name is required');
      }
      
      const table = airtableData.tables.find(t => t.name === config.tableName);
      if (!table) {
        throw new Error(`Table "${config.tableName}" not found`);
      }
      
      return table.records.map(record => ({
        id: record.id,
        fields: record.fields,
        createdTime: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Failed to fetch records:', error);
      throw new Error(error.message || 'Failed to fetch records from Airtable');
    }
  },

  // Get all tables
  async getTables() {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return airtableData.tables.map(table => ({
        id: `tbl${Math.random().toString(36).substr(2, 9)}`,
        name: table.name,
        description: `Table with ${table.records.length} records`,
        fields: table.fields.map(field => ({
          id: `fld${Math.random().toString(36).substr(2, 9)}`,
          name: field.name,
          type: field.type
        }))
      }));
    } catch (error) {
      console.error('Failed to fetch tables:', error);
      throw new Error('Failed to fetch tables from Airtable');
    }
  },

  // Get fields for a specific table
  async getFields(config) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (!config?.tableName) {
        throw new Error('Table name is required');
      }
      
      const table = airtableData.tables.find(t => t.name === config.tableName);
      if (!table) {
        throw new Error(`Table "${config.tableName}" not found`);
      }
      
      return table.fields.map(field => ({
        id: `fld${Math.random().toString(36).substr(2, 9)}`,
        name: field.name,
        type: field.type,
        description: `Field of type ${field.type}`
      }));
    } catch (error) {
      console.error('Failed to fetch fields:', error);
      throw new Error(error.message || 'Failed to fetch fields from Airtable');
    }
  },

  // Get record by ID
  async getRecord(config, recordId) {
    try {
      if (!config?.tableName || !recordId) {
        throw new Error('Table name and record ID are required');
      }
      
      const table = airtableData.tables.find(t => t.name === config.tableName);
      if (!table) {
        throw new Error(`Table "${config.tableName}" not found`);
      }
      
      const record = table.records.find(r => r.id === recordId);
      if (!record) {
        throw new Error(`Record "${recordId}" not found`);
      }
      
      return {
        id: record.id,
        fields: record.fields,
        createdTime: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to fetch record:', error);
      throw new Error(error.message || 'Failed to fetch record from Airtable');
    }
  }
};

export { airtableService };
export default airtableService;