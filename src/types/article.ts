export interface Article {
  id: number
  title: string
  summary: string
  content: string
  cover: string
  tags: string[]
  views: number
  likes: number
  comments: number
  createdAt: string
  updatedAt: string
  readTime: number
}

export interface Tag {
  name: string
  count: number
}

export interface ArchiveItem {
  year: number
  month: number
  count: number
}

export interface ArticleQuery {
  page?: number
  pageSize?: number
  tag?: string
  keyword?: string
}
