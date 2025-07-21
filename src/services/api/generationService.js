import { toast } from 'react-toastify';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const generationService = {
  async getAll() {
    try {
      await delay(300);
      
      const params = {
        "fields": [
          { "field": { "Name": "Name" } },
          { "field": { "Name": "Tags" } },
          { "field": { "Name": "Owner" } },
          { "field": { "Name": "template_id" } },
          { "field": { "Name": "template_name" } },
          { "field": { "Name": "record_id" } },
          { "field": { "Name": "status" } },
          { "field": { "Name": "pdf_url" } },
          { "field": { "Name": "filename" } },
          { "field": { "Name": "size" } },
          { "field": { "Name": "pages" } },
          { "field": { "Name": "created_at" } },
          { "field": { "Name": "updated_at" } },
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
          "limit": 100,
          "offset": 0
        }
      };
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const response = await apperClient.fetchRecords('generation', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching generations:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      await delay(200);
      
      const params = {
        fields: [
          { "field": { "Name": "Name" } },
          { "field": { "Name": "Tags" } },
          { "field": { "Name": "Owner" } },
          { "field": { "Name": "template_id" } },
          { "field": { "Name": "template_name" } },
          { "field": { "Name": "record_id" } },
          { "field": { "Name": "status" } },
          { "field": { "Name": "pdf_url" } },
          { "field": { "Name": "filename" } },
          { "field": { "Name": "size" } },
          { "field": { "Name": "pages" } },
          { "field": { "Name": "created_at" } },
          { "field": { "Name": "updated_at" } },
          { "field": { "Name": "CreatedOn" } },
          { "field": { "Name": "CreatedBy" } },
          { "field": { "Name": "ModifiedOn" } },
          { "field": { "Name": "ModifiedBy" } }
        ]
      };
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const response = await apperClient.getRecordById('generation', parseInt(id), params);
      
      if (!response || !response.data) {
        throw new Error('Generation not found');
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching generation with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw new Error('Generation not found');
    }
  },

  async create(generationData) {
    try {
      await delay(400);
      
      // Only include Updateable fields
      const updateableData = {
        Name: generationData.Name || generationData.name || 'PDF Generation',
        Tags: generationData.Tags,
        Owner: parseInt(generationData.Owner),
        template_id: parseInt(generationData.template_id || generationData.templateId),
        template_name: generationData.template_name || generationData.templateName,
        record_id: generationData.record_id || generationData.recordId,
        status: generationData.status || 'pending',
        pdf_url: generationData.pdf_url || generationData.pdfUrl,
        filename: generationData.filename,
        size: parseInt(generationData.size || 0),
        pages: parseInt(generationData.pages || 0),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const params = {
        records: [updateableData]
      };
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const response = await apperClient.createRecord('generation', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create generation ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
      
      throw new Error('Failed to create generation');
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating generation:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async updateStatus(id, status, pdfUrl = null) {
    try {
      await delay(200);
      
      const updateableData = {
        Id: parseInt(id),
        status: status,
        pdf_url: pdfUrl,
        updated_at: new Date().toISOString()
      };
      
      const params = {
        records: [updateableData]
      };
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const response = await apperClient.updateRecord('generation', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update generation ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          return successfulUpdates[0].data;
        }
      }
      
      throw new Error('Failed to update generation status');
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating generation status:", error?.response?.data?.message);
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
      
      const response = await apperClient.deleteRecord('generation', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete generation ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length === 1;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting generation:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
}