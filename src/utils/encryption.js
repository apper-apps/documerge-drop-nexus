// Simple encryption utilities for demo purposes
// In production, use proper encryption libraries

export const encryptData = (data) => {
  try {
    const jsonString = JSON.stringify(data)
    return btoa(jsonString) // Base64 encoding
  } catch (error) {
    console.error('Encryption error:', error)
    return null
  }
}

export const decryptData = (encryptedData) => {
  try {
    const jsonString = atob(encryptedData) // Base64 decoding
    return JSON.parse(jsonString)
  } catch (error) {
    console.error('Decryption error:', error)
    return null
  }
}

export const maskApiKey = (apiKey) => {
  if (!apiKey || apiKey.length < 8) return apiKey
  const start = apiKey.slice(0, 4)
  const end = apiKey.slice(-4)
  const middle = '*'.repeat(apiKey.length - 8)
  return `${start}${middle}${end}`
}