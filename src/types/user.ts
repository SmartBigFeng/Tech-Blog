export interface User {
  id: number
  name: string
  avatar: string
  bio: string
  role: string
  stats: UserStats
  social: SocialLinks
}

export interface UserStats {
  articles: number
  views: number
  likes: number
  comments: number
}

export interface SocialLinks {
  github: string
  juejin: string
  email: string
}
