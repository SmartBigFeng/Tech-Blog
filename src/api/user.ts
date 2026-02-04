import api from './index'
import type { User } from '@/types/user'
import type { Response } from '@/types/index'

export const userApi = {
  // 获取用户信息
  getUser() {
    return api.get<Response<User>>('/user')
  }
}
