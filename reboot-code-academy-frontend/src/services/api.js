const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000'

export async function fetchHelloMessage() {
  const response = await fetch(`${API_BASE_URL}/api/hello`)

  if (!response.ok) {
    throw new Error('Backend request failed')
  }

  const data = await response.json()

  return data.message
}
