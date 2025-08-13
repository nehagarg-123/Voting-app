import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const signup = (data) => api.post('/user/signup', data)
export const login = (data) => api.post('/user/login', data)
export const fetchCandidates = () => api.get('/candidate')
export const voteCandidate = (id) => api.post(`/candidate/vote/${id}`)
export const fetchElection = () => api.get('/election')

export default api
