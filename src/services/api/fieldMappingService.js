import { toast } from 'react-toastify';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const fieldMappingService = {
  async getAll() {
    try {
      await delay(300);
      
      const params = {
        "fields": [
          { "field": { "Name": "Name" } },
          { "field": { "Name": "Tags" } },
          { "field": { "Name": "Owner" } },
          { "field": { "Name": "doc_placeholder" } },
          { "field": { "Name": "airtable_field" } },
          { "field": { "Name": "field_type" } },
          { "field": { "Name": "is_line_item" } },
          { "field": { "Name": "template" } },
          { "field": { "Name": "CreatedOn" } },
          { "field": { "Name": "CreatedBy" } },
          { "field": { "Name": "ModifiedOn" } },
          { "field": { "Name": "ModifiedBy" } }
        ],
        "orderBy": [
          {
            "fieldName": "CreatedOn",
            "sorttype": "DESC"
          }
        ],
        "pagingInfo": {
          "limit": 200,
          "offset": 0
        }
      };
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const response = await apperClient.fetchRecords('field_mapping', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching field mappings:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getByTemplateId(templateId) {
    try {
      await delay(200);
      
      const params = {
        "fields": [
          { "field": { "Name": "Name" } },
          { "field": { "Name": "Tags" } },
          { "field": { "Name": "Owner" } },
          { "field": { "Name": "doc_placeholder" } },
          { "field": { "Name": "airtable_field" } },
          { "field": { "Name": "field_type" } },
          { "field": { "Name": "is_line_item" } },
          { "field": { "Name": "template" } }
        ],
        "where": [
          {
            "FieldName": "template",
            "Operator": "EqualTo",
            "Values": [parseInt(templateId)]
          }
        ],
        "orderBy": [
          {
            "fieldName": "Name",
            "sorttype": "ASC"
          }
        ]
      };
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const response = await apperClient.fetchRecords('field_mapping', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching field mappings for template ${templateId}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async create(mappingData) {
    try {
      await delay(400);
      
      // Only include Updateable fields
      const updateableData = {
        Name: mappingData.Name || mappingData.name || 'Field Mapping',
        Tags: mappingData.Tags,
        Owner: parseInt(mappingData.Owner),
        doc_placeholder: mappingData.doc_placeholder || mappingData.docPlaceholder,
        airtable_field: mappingData.airtable_field || mappingData.airtableField,
        field_type: mappingData.field_type || mappingData.fieldType,
        is_line_item: mappingData.is_line_item || mappingData.isLineItem || false,
        template: parseInt(mappingData.template || mappingData.templateId)
      };
      
      const params = {
        records: [updateableData]
      };
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const response = await apperClient.createRecord('field_mapping', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create field mapping ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data;
        }
      }
      
      throw new Error('Failed to create field mapping');
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating field mapping:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async createBulk(mappingsData) {
    try {
      await delay(500);
      
      const updateableRecords = mappingsData.map(mappingData => ({
        Name: mappingData.Name || mappingData.name || 'Field Mapping',
        Tags: mappingData.Tags,
        Owner: parseInt(mappingData.Owner),
        doc_placeholder: mappingData.doc_placeholder || mappingData.docPlaceholder,
        airtable_field: mappingData.airtable_field || mappingData.airtableField,
        field_type: mappingData.field_type || mappingData.fieldType,
        is_line_item: mappingData.is_line_item || mappingData.isLineItem || false,
        template: parseInt(mappingData.template || mappingData.templateId)
      }));
      
      const params = {
        records: updateableRecords
      };
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const response = await apperClient.createRecord('field_mapping', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create field mappings ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulRecords.map(result => result.data);
      }
      
      return [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating bulk field mappings:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async delete(id) {
    try {
      await delay(300);
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const response = await apperClient.deleteRecord('field_mapping', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete field mapping ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length === 1;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting field mapping:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  },

  async deleteByTemplateId(templateId) {
    try {
      // First get all field mappings for this template
      const mappings = await this.getByTemplateId(templateId);
      
      if (mappings.length === 0) {
        return true; // Nothing to delete
      }
      
      const recordIds = mappings.map(mapping => parseInt(mapping.Id));
      
      const params = {
        RecordIds: recordIds
      };
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const response = await apperClient.deleteRecord('field_mapping', params);
      
      if (!response.success) {
        console.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete field mappings ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        }
        
        return successfulDeletions.length === recordIds.length;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting field mappings by template:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
}