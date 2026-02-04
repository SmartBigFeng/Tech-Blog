import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userApi } from '@/api/user'
import type { User } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isLoggedIn = computed(() => !!user.value)
  const userStats = computed(() => user.value?.stats)
  const socialLinks = computed(() => user.value?.social)

  // Actions
  const fetchUser = async () => {
    loading.value = true
    error.value = null

    try {
      const res = await userApi.getUser()
      if (res.code === 0) {
        user.value = res.data
      }
    } catch (err) {
      error.value = 'Failed to fetch user data'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    error,
    isLoggedIn,
    userStats,
    socialLinks,
    fetchUser
  }
})
