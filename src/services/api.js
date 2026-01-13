import axios from "axios"

const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const API_URL = isLocal 
  ? (import.meta.env.VITE_LOCAL_API_URL || "http://localhost:5000") 
  : (import.meta.env.VITE_API_URL || "https://skilltrack-pro-backend.onrender.com");

export const api = axios.create({
  baseURL: API_URL,
})

// API Functions
export const loginUser = async (credentials) => {
  const response = await api.post("/login", credentials)
  return response.data
}

export const registerUser = async (userData) => {
  const response = await api.post("/register", userData)
  return response.data
}

export const createEntry = async (entryData) => {
  const response = await api.post("/entries", entryData)
  return response.data
}

export const getUserEntries = async (userId) => {
  const response = await api.get(`/entries/${userId}`)
  return response.data
}

export const getAllEntries = async () => {
  const response = await api.get("/entries")
  return response.data
}

// User Management APIs
export const getAllUsers = async () => {
  const response = await api.get("/users")
  return response.data
}

export const createUser = async (userData) => {
  const response = await api.post("/users", userData)
  return response.data
}

export const updateUser = async (userId, userData) => {
  const response = await api.put(`/users/${userId}`, userData)
  return response.data
}

// System Options APIs
export const getOptions = async () => {
  const response = await api.get("/options")
  return response.data
}

export const createOption = async (optionData) => {
  const response = await api.post("/options", optionData)
  return response.data
}

export const updateOption = async (optionId, optionData) => {
  const response = await api.put(`/options/${optionId}`, optionData)
  return response.data
}

export const deleteOption = async (optionId) => {
  const response = await api.delete(`/options/${optionId}`)
  return response.data
}

export const forgotPassword = async (email) => {
  const response = await api.post('/forgot-password', { email })
  return response.data
}

export const resetPassword = async (data) => {
  const response = await api.post('/reset-password', data)
  return response.data
}
