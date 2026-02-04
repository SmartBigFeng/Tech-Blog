import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

interface VisitorState {
  id: string
  likes: number[]      // 点赞的文章 ID 列表
  visitHistory: {
    articleId: number
    visitTime: string
  }[]
}

export const useVisitorStore = defineStore('visitor', () => {
  // 访客状态存储
  const state = useStorage<VisitorState>('visitor-state', {
    id: '',
    likes: [],
    visitHistory: [],
  })

  // 是否已点赞
  const isLiked = computed(() => {
    return (articleId: number) => state.value.likes.includes(articleId)
  })

  // 点赞数量
  const likeCount = computed(() => state.value.likes.length)

  // 设置访客 ID
  const setVisitorId = (id: string) => {
    state.value.id = id
  }

  // 添加点赞
  const addLike = (articleId: number) => {
    if (!state.value.likes.includes(articleId)) {
      state.value.likes.push(articleId)
    }
  }

  // 取消点赞
  const removeLike = (articleId: number) => {
    const index = state.value.likes.indexOf(articleId)
    if (index > -1) {
      state.value.likes.splice(index, 1)
    }
  }

  // 切换点赞状态
  const toggleLike = (articleId: number): boolean => {
    if (isLiked.value(articleId)) {
      removeLike(articleId)
      return false
    } else {
      addLike(articleId)
      return true
    }
  }

  // 记录访问历史
  const recordVisit = (articleId: number) => {
    state.value.visitHistory.unshift({
      articleId,
      visitTime: new Date().toISOString(),
    })
    // 只保留最近 100 条
    if (state.value.visitHistory.length > 100) {
      state.value.visitHistory = state.value.visitHistory.slice(0, 100)
    }
  }

  // 清空所有数据（调试用）
  const clearAll = () => {
    state.value = {
      id: '',
      likes: [],
      visitHistory: [],
    }
  }

  return {
    visitorId: computed(() => state.value.id),
    likes: computed(() => state.value.likes),
    likeCount,
    isLiked,
    setVisitorId,
    addLike,
    removeLike,
    toggleLike,
    recordVisit,
    clearAll,
  }
})
