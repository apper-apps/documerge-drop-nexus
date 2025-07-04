import generationData from '@/services/mockData/generations.json'

let generations = [...generationData]

export const generationService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return generations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const generation = generations.find(g => g.Id === id)
    if (!generation) {
      throw new Error('Generation not found')
    }
    return generation
  },

  async create(generationData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const maxId = generations.length > 0 ? Math.max(...generations.map(g => g.Id)) : 0
    const newGeneration = {
      ...generationData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    generations.push(newGeneration)
    return newGeneration
  },

  async updateStatus(id, status, pdfUrl = null) {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const index = generations.findIndex(g => g.Id === id)
    if (index === -1) {
      throw new Error('Generation not found')
    }
    
    generations[index] = {
      ...generations[index],
      status,
      pdfUrl,
      updatedAt: new Date().toISOString()
    }
    
    return generations[index]
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = generations.findIndex(g => g.Id === id)
    if (index === -1) {
      throw new Error('Generation not found')
    }
    
    generations.splice(index, 1)
    return true
  }
}