import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { articleApi } from '@/api/article'
import type { Article, Tag, ArchiveItem, ArticleQuery } from '@/types/article'

export const useArticleStore = defineStore('article', () => {
  // State
  const articles = ref<Article[]>([])
  const currentArticle = ref<Article | null>(null)
  const tags = ref<Tag[]>([])
  const archives = ref<ArchiveItem[]>([])
  const searchResults = ref<Article[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(6)

  // Getters
  const hasMore = computed(() => articles.value.length < total.value)
  const sortedTags = computed(() => {
    return [...tags.value].sort((a, b) => b.count - a.count)
  })
  const hotArticles = computed(() => {
    return [...articles.value]
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)
  })
  const formattedArchives = computed(() => {
    return archives.value.map(archive => ({
      ...archive,
      label: `${archive.year}年${archive.month}月`,
      value: `${archive.year}-${String(archive.month).padStart(2, '0')}`
    }))
  })

  // Actions
  const fetchArticles = async (params?: ArticleQuery) => {
    loading.value = true
    error.value = null

    try {
      const res = await articleApi.getArticles({
        page: currentPage.value,
        pageSize: pageSize.value,
        ...params
      })
      if (res.code === 0) {
        articles.value = res.data.list
        total.value = res.data.total
      }
    } catch (err) {
      error.value = 'Failed to fetch articles'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const fetchArticleById = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      const res = await articleApi.getArticleById(id)
      if (res.code === 0) {
        currentArticle.value = res.data
      }
    } catch (err) {
      error.value = 'Failed to fetch article'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const fetchTags = async () => {
    try {
      const res = await articleApi.getTags()
      if (res.code === 0) {
        tags.value = res.data
      }
    } catch (err) {
      console.error('Failed to fetch tags:', err)
    }
  }

  const fetchArchives = async () => {
    try {
      const res = await articleApi.getArchives()
      if (res.code === 0) {
        archives.value = res.data
      }
    } catch (err) {
      console.error('Failed to fetch archives:', err)
    }
  }

  const searchArticles = async (keyword: string) => {
    if (!keyword.trim()) {
      searchResults.value = []
      return
    }

    loading.value = true
    try {
      const res = await articleApi.searchArticles(keyword)
      if (res.code === 0) {
        searchResults.value = res.data
      }
    } catch (err) {
      console.error('Search failed:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    articles,
    currentArticle,
    tags,
    archives,
    searchResults,
    loading,
    error,
    total,
    currentPage,
    pageSize,
    hasMore,
    sortedTags,
    hotArticles,
    formattedArchives,
    fetchArticles,
    fetchArticleById,
    fetchTags,
    fetchArchives,
    searchArticles
  }
})
