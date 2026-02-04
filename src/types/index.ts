// 通用类型定义

export interface Response<T> {
  code: number
  message: string
  data: T
}

export interface PaginationParams {
  page?: number
  pageSize?: number
}

export interface PaginationData<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}
