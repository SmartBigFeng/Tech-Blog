import api from './index'
import type { Article, Tag, ArchiveItem, ArticleQuery } from '@/types/article'
import type { Response, PaginationData } from '@/types/index'

export const articleApi = {
  // 获取文章列表
  getArticles(params?: ArticleQuery) {
    return api.get<Response<PaginationData<Article>>>('/articles', { params })
  },

  // 获取文章详情
  getArticleById(id: number) {
    return api.get<Response<Article>>(`/articles/${id}`)
  },

  // 获取标签列表
  getTags() {
    return api.get<Response<Tag[]>>('/tags')
  },

  // 获取归档数据
  getArchives() {
    return api.get<Response<ArchiveItem[]>>('/archives')
  },

  // 搜索文章
  searchArticles(keyword: string) {
    return api.get<Response<Article[]>>('/search', { params: { q: keyword } })
  }
}
