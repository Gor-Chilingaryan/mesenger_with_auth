import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
})


instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})


instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config


    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true 

      try {
        const refreshToken = localStorage.getItem('refreshToken')

         

        const res = await axios.post(`${API_URL}/refresh`, { refreshToken })

        if (res.status === 200) {

          localStorage.setItem('token', res.data.accessToken)
          localStorage.setItem('refreshToken', res.data.refreshToken)


          originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`


          return instance(originalRequest)
        }
      } catch (refreshError) {

        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')

        if (window.location.pathname !== '/') {
          window.location.href = '/'
        }
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default instance