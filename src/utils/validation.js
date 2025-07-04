export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const validateGoogleDocsUrl = (url) => {
  return validateUrl(url) && url.includes('docs.google.com')
}

export const validateAirtableApiKey = (apiKey) => {
  return apiKey && apiKey.length >= 10 && apiKey.startsWith('key')
}

export const validateAirtableBaseId = (baseId) => {
  return baseId && baseId.length >= 10 && baseId.startsWith('app')
}

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value !== ''
}

export const validateNumber = (value) => {
  return !isNaN(value) && isFinite(value)
}