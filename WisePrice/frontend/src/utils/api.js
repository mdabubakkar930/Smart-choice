import axios from 'axios'
import { getToken } from './auth'

const API_BASE_URL = 'http://localhost:8000'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth endpoints
export const login = async (email, password) => {
  const response = await api.post('/api/auth/login', {
    email,
    password
  })
  return response.data
}

// Smartphone endpoints
export const getSmartphones = async (params) => {
  const response = await api.get('/api/smartphones/', { params })
  return response.data
}

export const getSmartphone = async (id) => {
  const response = await api.get(`/api/smartphones/${id}`)
  return response.data
}

export const createSmartphone = async (data) => {
  const response = await api.post('/api/smartphones/', data)
  return response.data
}

export const updateSmartphone = async (id, data) => {
  const response = await api.put(`/api/smartphones/${id}`, data)
  return response.data
}

export const deleteSmartphone = async (id) => {
  const response = await api.delete(`/api/smartphones/${id}`)
  return response.data
}

// CSV endpoints
export const uploadCSV = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await api.post('/api/smartphones/import-csv', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}

export const exportCSV = async () => {
  const response = await api.get('/api/smartphones/export/csv', {
    responseType: 'text'
  })
  return response.data
}

// Utility endpoints
export const getBrands = async () => {
  const response = await api.get('/api/smartphones/brands/list')
  return response.data
}

export const getStats = async () => {
  const response = await api.get('/api/smartphones/stats/summary')
  return response.data
}

export default api
