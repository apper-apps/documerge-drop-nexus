// Real Airtable API integration
const AIRTABLE_API_BASE = 'https://api.airtable.com/v0';

// Helper function to make authenticated requests to Airtable API
const makeAirtableRequest = async (url, config) => {
  const headers = {
    'Authorization': `Bearer ${config.apiKey}`,
    'Content-Type': 'application/json'
  };
  
  const response = await fetch(url, { headers });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Airtable API error: ${response.status}`);
  }
  
  return response.json();
};

// Helper function to validate configuration
const validateConfig = (config) => {
  if (!config?.apiKey || !config?.baseId) {
    throw new Error('Missing required Airtable configuration: apiKey and baseId');
  }
  
  if (!config.tableName) {
    throw new Error('Table name is required');
  }
};
const airtableService = {
  // Test Airtable connection
  async testConnection(config) {
    try {
      validateConfig(config);
      
      // Make real API call to test connection and get table info
      const url = `${AIRTABLE_API_BASE}/${config.baseId}/${encodeURIComponent(config.tableName)}?maxRecords=1`;
      const response = await makeAirtableRequest(url, config);
      
      // Get table schema
      const schemaUrl = `${AIRTABLE_API_BASE}/${config.baseId}/${encodeURIComponent(config.tableName)}`;
      const schemaResponse = await makeAirtableRequest(schemaUrl + '?view=Grid%20view', config);
      
      return {
        success: true,
        tableInfo: {
          name: config.tableName,
          recordCount: response.records?.length || 0,
          fieldCount: Object.keys(response.records?.[0]?.fields || {}).length
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
      validateConfig(config);
      
      // Make real API call to fetch all records
      const url = `${AIRTABLE_API_BASE}/${config.baseId}/${encodeURIComponent(config.tableName)}`;
      let allRecords = [];
      let offset = null;
      
      do {
        const requestUrl = offset ? `${url}?offset=${offset}` : url;
        const response = await makeAirtableRequest(requestUrl, config);
        
        allRecords = allRecords.concat(response.records || []);
        offset = response.offset;
      } while (offset);
      
      return allRecords.map(record => ({
        id: record.id,
        fields: record.fields
      }));
    } catch (error) {
      throw new Error(`Failed to fetch records: ${error.message}`);
    }
  },
// Get table schema (fields)
  async getFields(config) {
    try {
      validateConfig(config);
      
      // Make real API call to get table schema
      const url = `${AIRTABLE_API_BASE}/${config.baseId}/${encodeURIComponent(config.tableName)}?maxRecords=1`;
      const response = await makeAirtableRequest(url, config);
      
      if (!response.records || response.records.length === 0) {
        return [];
      }
      
// Extract field information from the first record
      const sampleRecord = response.records[0];
      return Object.entries(sampleRecord.fields).map(([fieldName, fieldValue]) => {
        // Enhanced field type detection
        let fieldType = 'singleLineText'; // default
        
        if (typeof fieldValue === 'number') {
          fieldType = 'number';
        } else if (Array.isArray(fieldValue)) {
          // Check if it's attachments or linked records
          if (fieldValue.length > 0 && fieldValue[0]?.url) {
            fieldType = 'multipleAttachments';
          } else if (fieldValue.length > 0 && typeof fieldValue[0] === 'string') {
            fieldType = 'multipleSelect';
          } else {
            fieldType = 'multipleRecordLinks';
          }
        } else if (typeof fieldValue === 'string') {
          // Enhanced string field type detection
          if (fieldValue.includes('@') && fieldValue.includes('.')) {
            fieldType = 'email';
          } else if (fieldValue.match(/^https?:\/\//)) {
            fieldType = 'url';
          } else if (fieldValue.match(/^\d{4}-\d{2}-\d{2}/)) {
            fieldType = 'date';
          } else if (fieldValue.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/)) {
            fieldType = 'dateTime';
          } else if (fieldValue.length > 100) {
            fieldType = 'multilineText';
          }
        } else if (typeof fieldValue === 'boolean') {
          fieldType = 'checkbox';
        }
        
        // Handle special Airtable field types that might appear as computed values
        // These are often returned as strings but represent formula/lookup results
        if (typeof fieldValue === 'string' && fieldName.toLowerCase().includes('formula')) {
          fieldType = 'formula';
        } else if (typeof fieldValue === 'string' && fieldName.toLowerCase().includes('lookup')) {
          fieldType = 'lookup';
        } else if (typeof fieldValue === 'number' && fieldName.toLowerCase().includes('count')) {
          fieldType = 'count';
        } else if (typeof fieldValue === 'number' && fieldName.toLowerCase().includes('rollup')) {
          fieldType = 'rollup';
        } else if (typeof fieldValue === 'number' && fieldName.toLowerCase().includes('rating')) {
          fieldType = 'rating';
        }
        
        return {
          id: `fld${Math.random().toString(36).substr(2, 9)}`,
          name: fieldName,
          type: fieldType,
          description: `${fieldType} field from ${config.tableName}`
        };
      });
    } catch (error) {
      throw new Error(`Failed to fetch table schema: ${error.message}`);
    }
  },
// Get fields for a specific table
  async getTableFields(config) {
    try {
      // Use the existing getFields method for consistency
      return await this.getFields(config);
    } catch (error) {
      throw new Error(`Failed to fetch table fields: ${error.message}`);
    }
  },
// Create a new record
  async createRecord(config, fields) {
    try {
      validateConfig(config);
      
      // Make real API call to create record
      const url = `${AIRTABLE_API_BASE}/${config.baseId}/${encodeURIComponent(config.tableName)}`;
      const requestBody = {
        fields: fields
      };
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Failed to create record: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to create record: ${error.message}`);
    }
  }
};

export { airtableService };
export default airtableService;