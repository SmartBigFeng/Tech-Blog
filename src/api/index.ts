import axios from 'axios'
import type { Response } from '@/types'

// 创建 axios 实例
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 可以在这里添加 token 等
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

// 创建类型安全的 API 客户端
const apiClient = {
  get: <T>(url: string, config?: any) => {
    return api.get<Response<T>>(url, config) as Promise<Response<T>>
  },
  post: <T>(url: string, data?: any, config?: any) => {
    return api.post<Response<T>>(url, data, config) as Promise<Response<T>>
  },
  put: <T>(url: string, data?: any, config?: any) => {
    return api.put<Response<T>>(url, data, config) as Promise<Response<T>>
  },
  delete: <T>(url: string, config?: any) => {
    return api.delete<Response<T>>(url, config) as Promise<Response<T>>
  }
}

export default apiClient
