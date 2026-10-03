const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1'

async function request(endpoint, options = {}) {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    }
  )

  if (!response.ok) {
    let errorMessage = 'Something went wrong'

    try {
      const errorData = await response.json()

      errorMessage =
        errorData.detail ||
        errorData.message ||
        errorMessage
    } catch {
      // Ignore JSON parsing errors
    }

    throw new Error(errorMessage)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

// =========================================
// FILE UPLOAD
// =========================================

async function upload(endpoint, formData) {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      method: 'POST',
      body: formData,
    }
  )

  if (!response.ok) {
    let errorMessage = 'File upload failed'

    try {
      const errorData = await response.json()

      errorMessage =
        errorData.detail ||
        errorData.message ||
        errorMessage
    } catch {
      // Ignore JSON parsing errors
    }

    throw new Error(errorMessage)
  }

  return response.json()
}

// =========================================
// API
// =========================================

export const api = {
  get: (endpoint) =>
    request(endpoint),

  post: (endpoint, data) =>
    request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  put: (endpoint, data) =>
    request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (endpoint) =>
    request(endpoint, {
      method: 'DELETE',
    }),

  upload: (endpoint, formData) =>
    upload(endpoint, formData),
}

// =========================================
// BACKEND HELLO TEST
// =========================================

export async function fetchHelloMessage() {
  const response = await fetch(
    'http://127.0.0.1:8000/api/hello'
  )

  if (!response.ok) {
    throw new Error(
      'Failed to fetch hello message'
    )
  }

  return response.json()
}