const mockPlaceholders = [
  '{{customer_name}}',
  '{{customer_email}}',
  '{{invoice_number}}',
  '{{invoice_date}}',
  '{{due_date}}',
  '{{total_amount}}',
  '{{line_items}}',
  '{{notes}}',
  '{{company_logo}}'
]

export const googleDocsService = {
  async getPlaceholders(googleDocUrl) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    if (!googleDocUrl) {
      throw new Error('Google Docs URL is required')
    }
    
    // Simulate URL validation
    if (!googleDocUrl.includes('docs.google.com')) {
      throw new Error('Invalid Google Docs URL')
    }
    
    // Simulate parsing document for placeholders
    // In real implementation, this would parse the actual document
    return mockPlaceholders
  },

  async getDocumentContent(googleDocUrl) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    if (!googleDocUrl) {
      throw new Error('Google Docs URL is required')
    }
    
    // Simulate document content extraction
    return {
      title: 'Invoice Template',
      content: 'Document content with placeholders...',
      placeholders: mockPlaceholders
    }
  }
}