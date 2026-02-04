import axios, { type AxiosRequestConfig } from 'axios'
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

// 类型安全的请求函数
function request<T>(config: AxiosRequestConfig): Promise<Response<T>> {
  return api.request<Response<T>>(config) as unknown as Promise<Response<T>>
}

const apiClient = {
  get: <T>(url: string, config?: AxiosRequestConfig) => request<T>({ ...config, method: 'GET', url }),
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => request<T>({ ...config, method: 'POST', url, data }),
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => request<T>({ ...config, method: 'PUT', url, data }),
  delete: <T>(url: string, config?: AxiosRequestConfig) => request<T>({ ...config, method: 'DELETE', url })
}

export default apiClient
