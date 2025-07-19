import airtableData from "@/services/mockData/airtableData.json";

// Helper function to find table with flexible matching
const findTable = (tableName) => {
  if (!tableName) return null;
  
  // First try exact match
  let table = airtableData.tables.find(t => t.name === tableName);
  
  // If not found, try case-insensitive partial match
  if (!table) {
    const lowerSearchName = tableName.toLowerCase();
    table = airtableData.tables.find(t => 
      t.name.toLowerCase().includes(lowerSearchName) || 
      lowerSearchName.includes(t.name.toLowerCase())
    );
  }
  
  return table;
};

// Helper function to get available table names for error messages
const getAvailableTableNames = () => {
  return airtableData.tables.map(t => t.name).join(', ');
};

const airtableService = {
  // Test Airtable connection
  async testConnection(config) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate configuration
      if (!config?.apiKey || !config?.baseId || !config?.tableName) {
        throw new Error('Missing required configuration');
      }
      
      const table = findTable(config.tableName);
      if (!table) {
        const availableTables = getAvailableTableNames();
        throw new Error(`Table "${config.tableName}" not found. Available tables: ${availableTables}`);
      }
      
      return {
        success: true,
        tableInfo: {
          name: table.name,
          recordCount: table.records.length,
          fieldCount: table.fields.length
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get all records from a table
  async getRecords(config) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Validate configuration
      if (!config?.apiKey || !config?.baseId || !config?.tableName) {
        throw new Error('Missing required configuration');
      }
      
      const table = findTable(config.tableName);
      if (!table) {
        const availableTables = getAvailableTableNames();
        throw new Error(`Table "${config.tableName}" not found. Available tables: ${availableTables}`);
      }
      
      return table.records.map(record => ({
        id: record.id,
        fields: record.fields
      }));
    } catch (error) {
      throw new Error(`Failed to fetch records: ${error.message}`);
    }
  },

  // Get table schema (fields) - returns all tables
  async getFields(config) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // If specific table requested, return its fields
      if (config?.tableName) {
        const table = findTable(config.tableName);
        if (!table) {
          const availableTables = getAvailableTableNames();
          throw new Error(`Table "${config.tableName}" not found. Available tables: ${availableTables}`);
        }
        
        return table.fields.map(field => ({
          id: `fld${Math.random().toString(36).substr(2, 9)}`,
          name: field.name,
          type: field.type,
          description: `${field.type} field from ${table.name}`
        }));
      }
      
      // Return all tables with their fields
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
      throw new Error(`Failed to fetch table schema: ${error.message}`);
    }
  },

  // Get fields for a specific table
  async getTableFields(config) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Validate configuration
      if (!config?.apiKey || !config?.baseId || !config?.tableName) {
        throw new Error('Missing required configuration');
      }
      
      const table = findTable(config.tableName);
      if (!table) {
        const availableTables = getAvailableTableNames();
        throw new Error(`Table "${config.tableName}" not found. Available tables: ${availableTables}`);
      }
      
      return table.fields.map(field => ({
        id: `fld${Math.random().toString(36).substr(2, 9)}`,
        name: field.name,
        type: field.type,
        description: `${field.type} field`
      }));
    } catch (error) {
      throw new Error(`Failed to fetch table fields: ${error.message}`);
    }
  },

  // Create a new record
  async createRecord(config, fields) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Validate configuration
      if (!config?.apiKey || !config?.baseId || !config?.tableName) {
        throw new Error('Missing required configuration');
      }
      
      const table = findTable(config.tableName);
      if (!table) {
        const availableTables = getAvailableTableNames();
        throw new Error(`Table "${config.tableName}" not found. Available tables: ${availableTables}`);
      }
      
      // Generate a new record ID
      const newId = `rec${Math.random().toString(36).substr(2, 15)}`;
      
      return {
        id: newId,
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