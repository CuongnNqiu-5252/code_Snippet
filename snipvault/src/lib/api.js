import axios from 'axios'

const BASE = 'http://localhost:8000'

export const http = axios.create({ baseURL: BASE })

/* Attach JWT to every request */
http.interceptors.request.use(cfg => {
  const token = localStorage.getItem('snipvault_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

/* Auto-logout on 401 */
http.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('snipvault_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

/* Auth */
export const register = (data) => http.post('/auth/register', data)
export const login    = (data) => http.post('/auth/login', data)

/* Snippets */
export const getSnippets   = (params) => http.get('/snippets', { params })
export const getSnippet    = (id)     => http.get(`/snippets/${id}`)
export const createSnippet = (data)   => http.post('/snippets', data)
export const updateSnippet = (id, data) => http.put(`/snippets/${id}`, data)
export const deleteSnippet = (id)     => http.delete(`/snippets/${id}`)

/* Search */
export const keywordSearch  = (q, language) => http.get('/search', { params: { q, language } })
export const semanticSearch = (q)           => http.get('/search/semantic', { params: { q } })

/* Bookmarks */
export const getBookmarks   = ()   => http.get('/bookmarks')
export const toggleBookmark = (id) => http.post(`/bookmarks/${id}`)

/* Recommendations */
export const getRecommendations = ()   => http.get('/recommendations')
export const getRelated         = (id) => http.get(`/snippets/${id}/related`)
